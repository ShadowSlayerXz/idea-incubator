const express = require('express');
const router = express.Router();
const { addComment, getCommentsByIdea, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/idea/:ideaId', getCommentsByIdea);
router.post('/idea/:ideaId', protect, addComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
