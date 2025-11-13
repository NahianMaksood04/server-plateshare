const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const verifyToken = require('../middleware/verifyToken');

// @route   POST api/requests
// @desc    Submit a food request
// @access  Private
router.post('/', verifyToken, requestController.requestFood);

// @route   GET api/requests/food/:foodId
// @desc    Get all requests for a specific food item (only for the food owner)
// @access  Private
router.get('/food/:foodId', verifyToken, requestController.getFoodRequests);

// @route   GET api/requests/my-requests
// @desc    Get all food requests made by the currently logged-in user
// @access  Private
router.get('/user', verifyToken, requestController.getMyFoodRequests);

// @route   PUT api/requests/:requestId/status
// @desc    Update the status of a food request (accept/reject)
// @access  Private (only for the food owner)
router.put('/:requestId/status', verifyToken, requestController.updateFoodRequestStatus);

module.exports = router;
