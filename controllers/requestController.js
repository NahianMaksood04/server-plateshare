const Request = require("../models/Request");
const Food = require("../models/Food");

exports.requestFood = async (req, res) => {
  try {
    const { foodId, pickupLocation, whyNeedFood, contactNumber } = req.body;

    if (!foodId || !pickupLocation || !whyNeedFood || !contactNumber)
      return res.status(400).json({ message: "All fields are required." });

    const requesterName = req.user.name || req.user.email;
    const requesterEmail = req.user.email;
    const requesterImage = req.user.picture || null;

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donatorEmail === requesterEmail)
      return res.status(400).json({ message: "Cannot request own food." });

    const existingRequest = await Request.findOne({ foodId, requesterEmail });
    if (existingRequest)
      return res.status(400).json({ message: "Already requested this food." });

    const newRequest = new Request({
      foodId,
      foodName: food.foodName,
      foodImage: food.foodImage,
      donatorEmail: food.donatorEmail,
      requesterEmail,
      requesterName,
      requesterImage,
      pickupLocation,
      whyNeedFood,
      contactNumber,
      requestStatus: "pending",
    });

    const request = await newRequest.save();
    res.status(201).json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getFoodRequests = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donatorEmail !== req.user.email)
      return res.status(401).json({ message: "Not authorized" });

    const requests = await Request.find({ foodId: req.params.foodId }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getMyFoodRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      requesterEmail: req.user.email,
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateFoodRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const food = await Food.findById(request.foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donatorEmail !== req.user.email)
      return res.status(401).json({ message: "Not authorized" });

    request.requestStatus = status;
    await request.save();

    if (status === "accepted") {
      food.foodStatus = "Donated";
      await food.save();
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};