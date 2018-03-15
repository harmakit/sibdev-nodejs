var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');


router.get('/', function(req, res) {
    if(req.isAuthenticated()){
    res.render('postForm',{
      messages: req.flash('message'),
      post: false,
      user: req.user
    })
  }else{
    res.redirect('/')
  }
});

router.post('/', postController.createPost);

module.exports = router;
