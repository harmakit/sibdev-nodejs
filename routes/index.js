var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');

router.get('/page/:page', postController.getPosts);
router.get('/', postController.getPosts);

module.exports = router;
