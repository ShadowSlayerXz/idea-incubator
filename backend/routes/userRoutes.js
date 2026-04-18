const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  saveIdea,
  unsaveIdea,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.patch('/save/:ideaId', protect, saveIdea);
router.patch('/unsave/:ideaId', protect, unsaveIdea);

module.exports = router;
