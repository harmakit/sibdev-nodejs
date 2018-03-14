var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');


router.get('/', function(req, res) {
    if(req.isAuthenticated()){
    res.render('postNew',{
      messages: req.flash('message'),
      user: req.user
    })
  }else{
    res.redirect('/')
  }
});

router.post('/', postController.create);


module.exports = router;
