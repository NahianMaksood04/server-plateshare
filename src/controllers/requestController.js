const Food = require("../models/Food");
const Request = require("../models/Request");
const { REQUEST_STATUS, FOOD_STATUS } = require("../utils/constants");

exports.createRequest = async (req, res) => {
  try {
    const { foodId, location, reason, contactNo } = req.body;
    if (!foodId || !location || !reason || !contactNo)
      return res.status(400).json({ message: "Missing required fields" });

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const userEmail = req.user.email;
    const userName = req.user.name || "User";
    const userPhoto = req.user.picture || "";

    const existing = await Request.findOne({ food: foodId, userEmail });
    if (existing) return res.status(409).json({ message: "You already requested this food" });

    const reqDoc = await Request.create({
      food: foodId,
      userEmail,
      userName,
      userPhoto,
      location,
      reason,
      contactNo,
      status: REQUEST_STATUS.PENDING,
    });

    res.status(201).json(reqDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRequestsForFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donorEmail !== req.user.email) return res.status(403).json({ message: "Forbidden" });

    const requests = await Request.find({ food: food._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (![REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.REJECTED].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const requestDoc = await Request.findById(id).populate("food");
    if (!requestDoc) return res.status(404).json({ message: "Request not found" });

    if (requestDoc.food.donorEmail !== req.user.email) return res.status(403).json({ message: "Forbidden" });

    requestDoc.status = status;
    await requestDoc.save();

    if (status === REQUEST_STATUS.ACCEPTED) {
      requestDoc.food.food_status = FOOD_STATUS.DONATED;
      await requestDoc.food.save();
    }

    res.json(requestDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const items = await Request.find({ userEmail: req.user.email }).populate("food").sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
