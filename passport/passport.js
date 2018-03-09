var db = require('../models');
const joi = require('joi');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.use('login', new LocalStrategy({
      passReqToCallback: true
    },
    async function(req, res){
      try{

        const schema = joi.object().keys({
          password: joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
          email: joi.string().required().email()
        });

        var valid = joi.validate({
          password: req.body.password,
          email: req.body.email
        }, schema);

        var authUser = await db.user.findOne({
            where: {
              email: req.body.email
            }
          });

        if (!authUser) {
          return done(null, false,
            res.render('login', {
              error: "Wrong email!!"} )
          );
        }

        if (valid.error !== null){
          return done(null, false,
           res.render('login', {
            error: valid.error} )
          );
        }

        var check_password = await authUser.verifyPassword(req.body.password);
        if(!check_password){
          return done(null, false,
            res.render('login', {
              error: "Wrong password!!"} )
          );
        }

        //auth
        return done(null, authUser, console.log(check_password.email));

      } catch(err){
          return done(null, false,
            res.render('login', {
              error: err
            })
          );
        }
      }
  ));
}
