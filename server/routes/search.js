const Incident = require('../model/incident');
const { JSONfiles } = require("../helper/files")
const { helpers } = require('../helper/helper');
var express = require('express');
var router = express.Router();
const { search, search_helpers } = require('../helper/search')

router.post('/', async (req, res) => {
    //await search();
    const TFIDF = await JSONfiles.readFile("TFIDF.json");
    const listWords = search_helpers.filter(req.body.words);

    const filteredWords = [];
    for (let i = 0; i < TFIDF.length; i++){
        const doc = TFIDF[i];
        doc.count = 0;
        
        for (let j = 0; j < doc.words.length; j++){
            if (listWords.includes(doc.words[j].word)){
                doc.count += doc.words[j].count;
            }
        }
        if (doc.count >0 ) filteredWords.push(doc);
    }
    
    filteredWords.sort((x, y) => {
        return y.count - x.count;
    });

    
    
    const incidentsId = filteredWords.map(doc => doc.indidentId);
    const incidents = await Incident.find({ _id: { $in: incidentsId } });
    await helpers.formatListIncidents(incidents, req.session.userId);
    
    req.session.search = incidents;
    
    res.status(200).json({
        user: req.session.user,
    });
});

module.exports = router;
