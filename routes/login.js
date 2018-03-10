var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('passport');
var loginController = require('../controllers/logincontroller.js');

router.post('/', loginController.login);

router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
