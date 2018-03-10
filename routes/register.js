var express = require('express');
var router = express.Router();
var db = require('../models');
var registerController = require('../controllers/registerController.js');

router.post('/', registerController.register);

router.get('/', function(req, res) {
  req.flash('info', 'Welcome');
  res.render('register');
});

module.exports = router;
