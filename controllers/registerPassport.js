var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');
const joi = require('joi');

module.exports = function(passport) {

  passport.use('register', new LocalStrategy({
      passReqToCallback: true
    },
      async function(req, email, password, done) {

        try{
          const schema = joi.object().keys({
            name: joi.string().required().alphanum().min(3).max(30),
            password: joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
            repassword: joi.string().required().valid(joi.ref('password')),
            email: joi.string().required().email()
          });

          var valid = joi.validate({
            name: req.body.name,
            password: req.body.password,
            repassword: req.body.repassword,
            email: req.body.email
          }, schema);

          if (valid.error !== null){
            return done(null, false, req.flash('error', valid.error));
          }

          var check_email = await db.user.findOne({
              where: {
                email: req.body.email
              }
            });

          if (!check_email) {
            console.log("User with this email already exists!");
            return done(null, false, req.flash('error', "User with this email already exists!"));
          }

          newUser = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
          };

          if(!check_password){
            console.log("Wrong password!");
            return done(null, false, req.flash('error', "Wrong password!"));
          }

          var createUser = await db.user.create(newUser);

          //auth
          return done(null, createUser);
        }
        catch(err){
          return done(null, false, req.flash('error', err));
        }

    }

  ));


}
