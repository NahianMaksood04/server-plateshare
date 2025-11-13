const Request = require('../models/Request');
const Food = require('../models/Food');

// @route   POST api/requests
// @desc    Submit a food request
// @access  Private
exports.requestFood = async (req, res) => {
  try {
    const { foodId, pickupLocation, whyNeedFood, contactNumber } = req.body;

    // Validate required fields from req.body
    if (!foodId) {
      return res.status(400).json({ message: 'Food ID is required.' });
    }
    if (!pickupLocation) {
      return res.status(400).json({ message: 'Pickup location is required.' });
    }
    if (!whyNeedFood) {
      return res.status(400).json({ message: 'Reason for needing food is required.' });
    }
    if (!contactNumber) {
      return res.status(400).json({ message: 'Contact number is required.' });
    }

    // Requester info comes from the authenticated user
    const requesterName = req.user.name || req.user.email;
    const requesterEmail = req.user.email;
    const requesterImage = req.user.picture || null;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Prevent donator from requesting their own food
    if (food.donatorEmail === requesterEmail) {
      return res.status(400).json({ message: 'You cannot request your own food item.' });
    }

    // Check if the user has already requested this food
    const existingRequest = await Request.findOne({ foodId, requesterEmail });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested this food item.' });
    }

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
      requestStatus: 'pending', // Default status
    });

    const request = await newRequest.save();
    res.status(201).json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/requests/food/:foodId
// @desc    Get all requests for a specific food item (only for the food owner)
// @access  Private
exports.getFoodRequests = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Ensure logged-in user is the donator of this food
    if (food.donatorEmail !== req.user.email) {
      return res.status(401).json({ message: 'User not authorized to view requests for this food' });
    }

    const requests = await Request.find({ foodId: req.params.foodId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   GET api/requests/my-requests
// @desc    Get all food requests made by the currently logged-in user
// @access  Private
exports.getMyFoodRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requesterEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @route   PUT api/requests/:requestId/status
// @desc    Update the status of a food request (accept/reject)
// @access  Private (only for the food owner)
exports.updateFoodRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    let request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: 'Food request not found' });
    }

    const food = await Food.findById(request.foodId);

    if (!food) {
      return res.status(404).json({ message: 'Associated food item not found' });
    }

    // Ensure logged-in user is the donator of the associated food
    if (food.donatorEmail !== req.user.email) {
      return res.status(401).json({ message: 'User not authorized to update this request' });
    }

    request.requestStatus = status;
    await request.save();

    // If accepted, update the food status to 'Donated'
    if (status === 'accepted') {
      food.foodStatus = 'Donated';
      await food.save();
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Food request or food not found' });
    }
    res.status(500).send('Server Error');
  }
};
