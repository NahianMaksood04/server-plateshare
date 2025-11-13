const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, requestController.createRequest);

router.get(
  "/food/:foodId",
  authMiddleware,
  requestController.getRequestsForFood,
);

router.get("/user", authMiddleware, requestController.getRequestsByUser);

router.patch("/:id/accept", authMiddleware, requestController.acceptRequest);

router.patch("/:id/reject", authMiddleware, requestController.rejectRequest);

module.exports = router;
