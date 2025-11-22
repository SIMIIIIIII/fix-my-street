const { helpers } = require('../helper/helper');
const Incident = require('../model/incident');
var express = require('express');
var router = express.Router();
const { search } = require('../helper/search')


router.get('/nav', (req, res) => {
  res.status(200).json({
      user: req.session.user,
    });
})

router.get('/', async (req, res) => {
  //await search();
  try {
    const incidents = req.session.search || await Incident.find().sort({ date: -1 });
    const userId = req.session.user ? req.session.user._id : req.session.userId;
    await helpers.formatListIncidents(incidents, userId);
    req.session.search = null;
    res.status(200).json({
      user: req.session.user,
      date: helpers.getDate(),
      incidents: incidents,
      mien: null,
      modify: null
    });

  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.get('/my_testemonies', async (req, res) => {
  try {
      const incidents = await Incident.find({"userId": req.session.userId}).sort({ date: -1 });
      
      await helpers.formatListIncidents(incidents, req.session.userId);

      res.status(200).json('home', {
        username: req.session.username,
        date: helpers.getDate(),
        incidents: incidents,
        mien: true,
        modify: null
      });
    } catch (error) {
      res.status(500).json({message: error.message});
    }
})

module.exports = router;