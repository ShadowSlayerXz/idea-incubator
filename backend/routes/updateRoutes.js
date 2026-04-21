const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUpdates, addUpdate, deleteUpdate } = require('../controllers/updateController');

router.get('/idea/:ideaId', getUpdates);
router.post('/idea/:ideaId', protect, addUpdate);
router.delete('/:updateId', protect, deleteUpdate);

module.exports = router;
