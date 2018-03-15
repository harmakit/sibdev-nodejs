var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');

router.get('/', function(req, res){ res.redirect('/')})
router.get('/:id', postController.getPost);

router.get('/:id/edit', postController.getPostForEditing);
router.post('/:id/edit', postController.editPost);
router.get('/:id/delete', postController.deletePost);

module.exports = router;
