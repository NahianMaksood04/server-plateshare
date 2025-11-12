// backend/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a request for a food (private)
router.post('/:foodId', authMiddleware, requestController.createRequest);

// Get all requests for a given food (only visible to owner)
router.get('/food/:foodId', authMiddleware, requestController.getRequestsForFood);

// Update request status (accept/reject)
router.patch('/:id/status', authMiddleware, requestController.updateRequestStatus);

module.exports = router;
