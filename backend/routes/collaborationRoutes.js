const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  submitRequest,
  getRequests,
  respondToRequest,
  getMyRequests,
} = require('../controllers/collaborationController');

router.use(protect);
router.get('/my-requests', getMyRequests);
router.post('/ideas/:ideaId/requests', submitRequest);
router.get('/ideas/:ideaId/requests', getRequests);
router.patch('/ideas/:ideaId/requests/:requestId', respondToRequest);

module.exports = router;
