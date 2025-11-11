const express = require("express");
const {
  createRequest,
  getRequestsForFood,
  updateRequestStatus,
  getMyRequests,
} = require("../controllers/requestController");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const router = express.Router();

// Protected routes
router.post("/", verifyFirebaseToken, createRequest);
router.get("/my", verifyFirebaseToken, getMyRequests);
router.get("/food/:foodId", verifyFirebaseToken, getRequestsForFood);
router.patch("/:id/status", verifyFirebaseToken, updateRequestStatus);

module.exports = router;
