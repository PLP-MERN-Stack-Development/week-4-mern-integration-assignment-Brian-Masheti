const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validatePost, handleValidationErrors } = require('../middleware/validation');
const auth = require('../middleware/auth');

// GET /api/posts
router.get('/', postController.getPosts);
// GET /api/posts/:id
router.get('/:id', postController.getPostById);
// POST /api/posts
router.post('/', auth, validatePost, handleValidationErrors, postController.createPost);
// PUT /api/posts/:id
router.put('/:id', auth, validatePost, handleValidationErrors, postController.updatePost);
// DELETE /api/posts/:id
router.delete('/:id', auth, postController.deletePost);

// POST /api/posts/:id/like
router.post('/:id/like', auth, postController.likePost);
// POST /api/posts/:id/unlike
router.post('/:id/unlike', auth, postController.unlikePost);

module.exports = router;
