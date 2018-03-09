var express = require('express');
var router = express.Router();
var db = require('../models');
const joi = require('joi');

router.post('/', async function (req, res) {
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
      error: "Wrong email!!"} );
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
      error: "Wrong password!!"} );
      return;
    }

    //auth
    res.render('index');
    return;

  } catch(err){
  console.log(err);
  res.render('login', {
    error: err} );
 }
});

router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
