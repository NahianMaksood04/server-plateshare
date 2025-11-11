// server/src/controllers/requestController.js

const Food = require("../models/Food");
const Request = require("../models/Request");
const { REQUEST_STATUS, FOOD_STATUS } = require("../utils/constants");

// 🟢 Create a new food request
exports.createRequest = async (req, res) => {
  try {
    const { foodId, location, reason, contactNo } = req.body;

    if (!foodId || !location || !reason || !contactNo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const userEmail = req.user.email;
    const userName = req.user.name || "User";
    const userPhoto = req.user.picture || "";

    const existing = await Request.findOne({ food: foodId, userEmail });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You already requested this food" });
    }

    const newRequest = await Request.create({
      food: foodId,
      userEmail,
      userName,
      userPhoto,
      location,
      reason,
      contactNo,
      status: REQUEST_STATUS.PENDING,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Server error while creating request" });
  }
};

// 🟣 Get all requests for a specific food (visible only to donor)
exports.getRequestsForFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.donorEmail !== req.user.email) {
      return res
        .status(403)
        .json({ message: "You are not allowed to view these requests" });
    }

    const requests = await Request.find({ food: foodId }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
};

// 🟠 Update request status (only food owner can accept/reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (![REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.REJECTED].includes(status)) {
      return res.status(400).json({ message: "Invalid request status" });
    }

    const requestDoc = await Request.findById(id).populate("food");
    if (!requestDoc) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only the food donor can approve/reject
    if (requestDoc.food.donorEmail !== req.user.email) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this request" });
    }

    requestDoc.status = status;
    await requestDoc.save();

    // If accepted → mark food as donated
    if (status === REQUEST_STATUS.ACCEPTED) {
      requestDoc.food.food_status = FOOD_STATUS.DONATED;
      await requestDoc.food.save();
    }

    res.json(requestDoc);
  } catch (error) {
    console.error("Error updating request status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating request status" });
  }
};

// 🔵 Get all requests made by logged-in user
exports.getMyRequests = async (req, res) => {
  try {
    const email = req.user.email;
    const myRequests = await Request.find({ userEmail: email })
      .populate("food")
      .sort({ createdAt: -1 });

    res.json(myRequests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching your requests" });
  }
};
