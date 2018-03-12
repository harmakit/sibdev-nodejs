var express = require('express');
var router = express.Router();

var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var profile = require('./routes/profile');
var logout = require('./routes/logout');

module.exports = function (passport) {

  router.use('/', index);
  router.use('/users', users);
  router.use('/register', register);
  router.use('/login', login);
  router.use('/profile', profile);
  router.use('/logout', logout);


  return router;
}
