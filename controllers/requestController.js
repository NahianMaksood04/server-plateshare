const Request = require("../models/Request");
const Food = require("../models/Food");

exports.createRequest = async (req, res) => {
  try {
    const { foodId, requestLocation, requestReason, contactNo } = req.body;
    const requesterEmail = req.user.email;

    const newRequest = new Request({
      foodId,
      requesterEmail,
      requesterName: req.user.name,
      requesterPhoto: req.user.picture,
      requestLocation,
      requestReason,
      contactNo,
      status: "pending",
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getRequestsForFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.donator.email !== req.user.email) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view these requests." });
    }

    const requests = await Request.find({ foodId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getRequestsByUser = async (req, res) => {
  try {
    const requests = await Request.find({ requesterEmail: req.user.email })
      .populate("foodId")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("foodId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.foodId.donator.email !== req.user.email) {
      return res.status(403).json({ message: "User not authorized" });
    }

    request.status = "accepted";
    await request.save();

    await Food.findByIdAndUpdate(request.foodId._id, { foodStatus: "Donated" });

    res.json({
      message: "Request accepted and food status updated to Donated.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("foodId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.foodId.donator.email !== req.user.email) {
      return res.status(403).json({ message: "User not authorized" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
