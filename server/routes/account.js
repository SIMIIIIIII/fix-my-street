const User = require('../model/user');
var express = require('express');
var router = express.Router();


router.get('/', async (req, res) => {
    if (!req.session.user) {
        res.json({user:null});
        return;
    }
    
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            res.json({user:null});
            return;
        }
        
        res.json({
            "user": user,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.render('account', { user: {}, error: 'Server error' });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.clearCookie('connect.sid');
        res.json({message: "ok"});
    });
});

module.exports = router;