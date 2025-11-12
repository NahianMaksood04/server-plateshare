const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/requests
// @desc    Create a new food request
// @access  Private
router.post('/', authMiddleware, requestController.createRequest);

// @route   GET api/requests/food/:foodId
// @desc    Get all requests for a specific food (for food owner)
// @access  Private
router.get('/food/:foodId', authMiddleware, requestController.getRequestsForFood);

// @route   GET api/requests/user
// @desc    Get all requests made by the logged-in user
// @access  Private
router.get('/user', authMiddleware, requestController.getRequestsByUser);

// @route   PATCH api/requests/:id/accept
// @desc    Accept a food request
// @access  Private
router.patch('/:id/accept', authMiddleware, requestController.acceptRequest);

// @route   PATCH api/requests/:id/reject
// @desc    Reject a food request
// @access  Private
router.patch('/:id/reject', authMiddleware, requestController.rejectRequest);

module.exports = router;
