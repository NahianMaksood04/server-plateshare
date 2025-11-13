const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, requestController.requestFood);
router.get('/food/:foodId', verifyToken, requestController.getFoodRequests);
router.get('/my-requests', verifyToken, requestController.getMyFoodRequests);
router.put('/:requestId/status', verifyToken, requestController.updateFoodRequestStatus);

module.exports = router;
