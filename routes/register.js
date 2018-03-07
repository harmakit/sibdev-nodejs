var express = require('express');
var router = express.Router();
const joi = require('joi');


const schema = joi.object().keys({
  name: joi.string().alphanum().min(3).max(30),
  password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  repassword: joi.string().required().valid(joi.ref('password')),
  email: joi.string().email()
});

router.post('/', function (req, res) {
  var valid = joi.validate({
    name: req.body.name,
    password: req.body.password,
    repassword: req.body.repassword,
    email: req.body.email
  }, schema);

res.render('register', {
  error: valid.error} )
});

router.get('/', function(req, res) {
  res.render('register');
});

module.exports = router;
