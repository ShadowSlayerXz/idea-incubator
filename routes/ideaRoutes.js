const express = require('express');
const router = express.Router();
const {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  expressInterest,
} = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');
const { ideaValidator } = require('../validators/ideaValidator');

router.get('/', getAllIdeas);
router.post('/', protect, ...ideaValidator, createIdea);
router.get('/:id', getIdeaById);
router.put('/:id', protect, ...ideaValidator, updateIdea);
router.delete('/:id', protect, deleteIdea);
router.patch('/:id/interest', protect, expressInterest);

module.exports = router;
