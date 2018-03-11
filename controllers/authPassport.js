var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');
const joi = require('joi');

module.exports = function(passport) {

  passport.use('auth', new LocalStrategy({
      passReqToCallback: true
    },
      async function(req, email, password, done) {

        try{

          const schema = joi.object().keys({
            password: joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
            email: joi.string().required().email()
          });

          var valid = await joi.validate({
            password: req.body.password,
            email: req.body.email
          }, schema);

          if (valid.error !== null){
            return done(null, false, req.flash('error', valid.error));
          }

          var authUser = await db.user.findOne({
              where: {
                email: req.body.email
              }
            });

          if (!authUser) {
            console.log("Wrong email!");
            return done(null, false, req.flash('error', "Wrong email!"));
          }

          var check_password = await authUser.verifyPassword(password);

          if(!check_password){
            console.log("Wrong password!");
            return done(null, false, req.flash('error', "Wrong password!"));
          }

          //auth
          return done(null, authUser);
        }
        catch(err){
          return done(null, false, req.flash('error', err));
        }

    }

  ));


}
