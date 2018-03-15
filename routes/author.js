var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');


router.get('/:id', postController.getPostsByUser);
router.get('/', postController.getMyPosts);

module.exports = router;
