var db = require('../models'), passportLocalSequelize = require('passport-local-sequelize');
const joi = require('joi');

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

    if (!authUser) {

        res.render('login', {
          error: "Wrong email!!"} )
        return;

    }

    if (valid.error !== null){
       res.render('login', {
        error: valid.error} );
        return;
    }

    var check_password = await authUser.verifyPassword(req.body.password);
    if(!check_password){

        res.render('login', {
          error: "Wrong password!!"} )
          return;
    }

    //auth

    module.exports = authUser;
    res.redirect('/');
    return;

  } catch(err){

        res.render('login', {
          error: err
        })
        return;
    }
}


//register
exports.register = async function (req, res) {
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

    var check_email = await db.user.findOne({
        where: {
          email: req.body.email
        }
      });

    if (check_email) {
       res.render('register', {
        error: "User with this email already exists!"} );
      return;
    }

    if (valid.error !== null){
       res.render('register', {
        error: valid.error} );
        return;
    }

    newUser = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    };

    await db.user.create(newUser);
    res.render('index');
    return;

  } catch(err){
  console.error(err);
  res.render('register', {
    error: err} );
 }
}
