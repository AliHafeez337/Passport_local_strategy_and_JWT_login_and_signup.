const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/* MONGOOSE SETUP */
var {UserDetails} = require('../models/user');

module.exports = {Local} = passport.use(new LocalStrategy(
  async function(username, password, done) {
    try{
        const user = await UserDetails.findByCredentials(username, password);
        console.log(user);
        return done(null, user);
    }
    catch{
        return done(null, false);
    }
  }
));
