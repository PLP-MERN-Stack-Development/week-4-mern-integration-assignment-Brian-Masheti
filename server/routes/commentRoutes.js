const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Get all comments for a post
router.get('/post/:postId', commentController.getCommentsByPost);

// Add a new comment to a post
router.post('/post/:postId', auth, commentController.addComment);

// Delete a comment
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;
