var express = require('express');
var router = express.Router();

var index = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var author = require('./routes/author');
var logout = require('./routes/logout');
var postCreate = require('./routes/postCreate');
var post = require('./routes/post');


module.exports = function (passport) {

  router.use('/', index);
  router.use('/register', register);
  router.use('/login', login);
  router.use('/author', author);
  router.use('/logout', logout);
  router.use('/post/new', postCreate);
  router.use('/post', post);


  return router;
}
