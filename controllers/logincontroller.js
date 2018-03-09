var db = require('../models');
const joi = require('joi');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var exports = module.exports = {}

exports.login = async function (req, res) {

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

    if (valid.error !== null){
      req.flash('error', valid.error);
      res.render('login');
      return;
    }

    if (!authUser) {
      req.flash('error', "Wrong email!!");
      res.render('login');
      return;
    }

    var check_password = await authUser.verifyPassword(req.body.password);
    if(!check_password){
      req.flash('error', "Wrong password!!");
      res.render('login');
      return;
    }

    //auth
    res.redirect('/');
    return;
  }
  catch(err){
      req.flash('error', err);
      res.render('login')
      return;
  }
}
