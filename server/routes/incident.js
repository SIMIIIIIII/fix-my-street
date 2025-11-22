const Incident = require('../model/incident');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const { checkUserInput } = require('../tests/checkInput');
const { search, search_helpers } = require('../helper/search');
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        user: req.session.user,
        incident: null,
        modify: req.session.modify
    });
    return;
});

router.post('/create', async (req, res) => {
    if (!req.session.user){
        res.status(401).json({error: "Please log in"});
        return;
    }
    
    if (!req.body.description || !req.body.adress){
        res.status(401).json({error: "Please log in"});
        return
    }
    
    const addressCheck = await checkUserInput.isAdressValid(req.body.adress);
    if (!addressCheck.valid) {
        res.status(401).json({error: "Invalid Adress"});
        return
    }
    
    const incident = {}
    incident.description = req.body.description;
    incident.adress = addressCheck.formattedAddress;
    incident.userId = req.session.user._id;
    let newIncident;
    
    try {
        if (req.body.id){
            const newIncident = await Incident.findByIdAndUpdate(req.params.id, incident, {new: true});
        }
        else newIncident = new Incident(incident);
        const savedIncident = await newIncident.save();

        if (!req.body.id){
            await User.findByIdAndUpdate(
                req.session.userId,
                { $push: { incidentsId: savedIncident._id } }
            )
        ;}
        
        // On me à jours notre TF-IDF
        try {
            await search_helpers.MAJsetTFIDF(savedIncident);
        } catch (tfidfError) {
            console.error('TF-IDF update error:', tfidfError);
        }
        
        res.json();
    } catch (error) {
        res.status(401).json({error: error});
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        if (req.session.user){
            const incident = await Incident.findById(req.params.id);
            if (incident.userId === req.session.user._id){
                const incident = await Incident.findByIdAndDelete(incident._id);
                
                // On me à jours notre TF-IDF
                await search_helpers.MAJsetTFIDF(incident, true);
                
                const user = await User.findByIdAndUpdate(
                    req.session.userId,
                    { $pop: { incidentsId: incident._id } }
                )
                user.save();
                req.session.user = user;
                res.json();
                return
            }

            res.status(401).json({error: "Not authorized"});
            return
        }
        res.status(401).json({error: "Please log in"});
    } catch (error) {
        res.status(500).json({error: error});
    }
});

router.get('/cleanup_incidents', async (req, res) => {
    if (!req.session.username){
        res.status(403);
        return
    }
    
    try {
        const user = await User.findById(req.session.userId);
        if (user.email !== process.env.EMAIL_USER &&
            !(await bcrypt.compare(user.password, `#${process.env.COMPTE_PASS}`))
        ){
            res.status(403).json({message: "Page non trouvé"});
            return;
        }
        
        const result = await Incident.deleteMany({ 
            $or: [
                { userId: null }, 
                { userId: { $exists: false } }
            ]
        });
        
        // On me à jours notre TF-IDF
        await search();
        
        res.json({ 
            message: 'Cleanup complete', 
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;