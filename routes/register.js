var express = require('express');
var router = express.Router();
var db = require('../models');
const joi = require('joi');


router.post('/', async function (req, res) {
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

    var result_email = db.user.findOne({
        where: {
          email: req.body.email
        }
      });

    if (await result_email) {
       res.render('register', {
        error: "User with this email already exists!"} );
      return;
    }
    else {
      if (valid.error !== null){
         res.render('register', {
          error: valid.error} );
          return;
      }
      else {
        newUser = {
          name: req.body.name,
          password: req.body.password,
          email: req.body.email
        };
        await db.user.create(newUser);
        res.render('index');
        return;
      }
    }
  } catch(err){
  console.error(err);
  res.render('register', {
    error: err} );
 }
});

router.get('/', function(req, res) {
  res.render('register');
});

module.exports = router;
