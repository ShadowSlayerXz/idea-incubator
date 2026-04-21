const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { getUsers, updateUserRole, deleteUser, deleteIdea } = require('../controllers/adminController');

router.use(protect, isAdmin);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.delete('/ideas/:id', deleteIdea);

module.exports = router;
