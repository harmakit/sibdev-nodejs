var passport = require('passport');
var registerController = require('./controllers/registerController.js')
var express = require('express');
var db = require('./models');

var isAuth = function (req, res, next){
  if (req.isAuthenticated()){
    res.redirect('/');
  }
  return next();
}

module.exports = function(passport) {
  var router = express.Router();


  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next()
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }
/*
  router.get('/register', registerController.show)
  router.post('/register', registerController.register)
*/
  router.get("/register", isAuth, (req, res) => {
     res.render("register", {
       messages: req.flash('error')
     })
   });

   router.post("/register",
    passport.authenticate('register', {
      successRedirect: '/auth',
      failureRedirect: '/register',
      failureFlash: true
    })

  );

  router.get('/login',
  isAuth, (req, res) => {
    res.render('login', {
      error: 'error'
    });
  })
  // function(req, res, next) {
  //   res.render('login');
  // })
  ;

  router.post('/login', //function(req, res, next) {
    passport.authenticate('auth', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  //}
);


  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/profile', function(req, res, next) {
    res.render('profile');
  });

  router.get('/dashboard', isAuthenticated, function(req, res) {
    res.render('profile')
  })

  router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
  })

  return router;
}
