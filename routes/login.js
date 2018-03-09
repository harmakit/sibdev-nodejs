var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('passport');
var loginController = require('../controllers/logincontroller.js');

/*
router.post('/', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/profile/+req.user.id');
  });
*/

router.post('/', loginController.login);

router.get('/', function(req, res) {
  req.flash('info', 'Welcome');
  res.render('login');
});

module.exports = router;
