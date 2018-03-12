var db = require('../models');
var LocalStrategy = require('passport-local').Strategy;
var joi = require('joi');

module.exports = function(passport) {
  passport.use('register', new LocalStrategy({
      passReqToCallback: true,
    },
  async function(req, username, password, done){

  try {

    var schema = joi.object().keys({
      username: joi.string().required().alphanum().min(3).max(30),
      password: joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
      repassword: joi.string().required().valid(joi.ref('password')),
      email: joi.string().required().email()
    });

    var valid = await joi.validate({
      username: req.body.username,
      password: req.body.password,
      repassword: req.body.repassword,
      email: req.body.email
    }, schema);

    var check_name = await db.user.findOne({
      where: {
        username: req.body.username,
      }
    });

    var check_email = await db.user.findOne({
      where: {
        email: req.body.email
      }
    });

    if (check_name) {
      return done(null, false, req.flash('message', 'Username already exists.'))
    }

    if (check_email) {
      return done(null, false, req.flash('message', 'Email already exists.'))
    }

    defNewUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }

    var createUser = await db.user.create(defNewUser);
    return done(null, createUser, console.log(createUser));

  } catch (err) {

    console.error(err);
    return done(null, false, req.flash('message', err.details[0].message))

    }
  }))
}
