var express = require('express');
var router = express.Router();
const Joi = require('joi');
/*
const schema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    repassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email()
});

var valid = Joi.validate({
      username: req.body.name,
      password: req.body.password,
      repassword: req.body.repassword,
      email: req.body.email
    }, schema);
*/

router.get('/', function(req, res, next) {
  res.render('register');
});

module.exports = router;
