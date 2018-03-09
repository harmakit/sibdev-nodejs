var express = require('express');
var router = express.Router();
var db = require('../models');
var authController = require('../controllers/authcontroller.js');

router.post('/', authController.register);

router.get('/', function(req, res) {
  res.render('register');
});

module.exports = router;
