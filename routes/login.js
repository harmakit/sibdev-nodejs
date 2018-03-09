var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('passport');
var authController = require('../controllers/authcontroller.js');


router.post('/', authController.login);

router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
