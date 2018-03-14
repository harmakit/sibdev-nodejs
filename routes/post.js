var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');

router.get('/:id', postController.getPost);
router.get('/', function(req, res){ res.redirect('/')})

module.exports = router;
