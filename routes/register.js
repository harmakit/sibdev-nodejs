var express = require('express');
var router = express.Router();
var passport = require('passport');


var isAuth = function (req, res, next){
  if (req.isAuthenticated()){
    res.redirect('/');
  }
  return next();
}

router.get('/', isAuth, (req, res) => {
  res.render('register', {
    messages: req.flash('message')
  })
});

router.post('/', passport.authenticate('register', { successRedirect: '/login',
                                   failureRedirect: '/register',
                                   failureFlash: true }));

module.exports = router;
