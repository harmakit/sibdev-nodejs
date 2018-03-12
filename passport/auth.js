var db = require('../models');
var LocalStrategy = require('passport-local').Strategy;
var joi = require('joi');

module.exports = function(passport) {
  passport.use('auth', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async function(req, email, password, done){

      try {

        var schema = joi.object().keys({
          email: joi.string().email(),
          password: joi.string().min(4).max(10)
        });

        var valid = await joi.validate({
          email: req.body.email,
          password: req.body.password,
        }, schema);

        var us = await db.user.findOne({
          where: {
            email: req.body.email,
          }
        })

        if (!us) {
          console.log("Incorrect username");
          return done(null, false, req.flash('message', 'Incorrect username.'));
        }

        var result = await us.verifyPassword(password);

        if (!result) {
          console.log("Incorrect password");
          return done(null, false, req.flash('message', 'Incorrect password.'));
        }

        return done(null, us, console.log(result.email));

      } catch(err) {
        console.error(err);
        return done(null, false, req.flash('message', err.details[0].message))
      }
    }
  ));
}
