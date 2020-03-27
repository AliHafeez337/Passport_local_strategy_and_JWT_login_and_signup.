var express = require('express');
var router = express.Router();
const passport = require('passport');
const _ = require('lodash');

var {UserDetails} = require('../models/user');

router.post('/',
  passport.authenticate('local', 
  { failureRedirect: '/error' }),
  function(req, res) {
    res.send("Welcome "+req.user+"!!");
});

router.post('/register', async (req, res) => {
    console.log('reached')
    try {
        var body = _.pick(req.body, ['email', 'password']);
        var user = new UserDetails(body);
        console.log(user);
        
        var doc1 = await user.save();
        res.status(200).send(doc1);
    }
    catch(e) {
        if ("errmsg" in e){
        res.status(400).send(e.errmsg);
        }
        res.status(400).send(e);
    }
});

module.exports = router;