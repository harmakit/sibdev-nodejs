var express = require('express');
var router = express.Router();
var passport = require('passport');

var isAuth = function (req, res, next){
  if (req.isAuthenticated()){
    res.redirect('/');
  }
  return next();
}

router.get('/',isAuth, function(req, res){
  res.render('login', {
    messages: req.flash('message')
  });
});

router.post('/',passport.authenticate('auth', { successRedirect: '/',
                                     failureRedirect: '/login',
                                     failureFlash: true }));

module.exports = router;
