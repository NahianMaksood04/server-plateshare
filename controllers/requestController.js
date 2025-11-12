// backend/controllers/requestController.js
const Request = require('../models/Request');
const Food = require('../models/Food');

exports.createRequest = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { location, reason, contact_no } = req.body;

    if (!location || !reason || !contact_no) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    // Create request with requester info from req.user
    const request = new Request({
      food: food._id,
      requester_name: req.user.name || 'Anonymous',
      requester_email: req.user.email,
      requester_image: req.user.picture || '',
      location,
      reason,
      contact_no
    });

    await request.save();

    // Optionally set food_status to 'Requested' (still available until owner accepts)
    if (food.food_status === 'Available') {
      food.food_status = 'Requested';
      await food.save();
    }

    return res.status(201).json(request);
  } catch (error) {
    console.error('createRequest error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getRequestsForFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    // Only owner can see requests for their food
    if (food.donator_email !== req.user.email) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }

    const requests = await Request.find({ food: foodId }).sort({ created_at: -1 });
    return res.json(requests);
  } catch (error) {
    console.error('getRequestsForFood error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params; // request id
    const { action } = req.body; // 'accept' or 'reject'

    const request = await Request.findById(id).populate('food');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const food = request.food;
    if (!food) return res.status(404).json({ message: 'Associated food not found' });

    // Only food owner can accept/reject
    if (food.donator_email !== req.user.email) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }

    if (action === 'accept') {
      request.status = 'accepted';
      food.food_status = 'Donated'; // per spec
      await request.save();
      await food.save();
      return res.json({ message: 'Request accepted' });
    } else if (action === 'reject') {
      request.status = 'rejected';
      await request.save();

      // If there are no other pending/accepted requests, set status back to Available
      const otherPending = await Request.findOne({ food: food._id, status: 'pending' });
      if (!otherPending) {
        food.food_status = 'Available';
        await food.save();
      }

      return res.json({ message: 'Request rejected' });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('updateRequestStatus error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
