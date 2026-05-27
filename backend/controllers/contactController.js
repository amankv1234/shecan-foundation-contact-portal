const Message = require('../models/Message');

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate request
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    console.error('Error in submitContact:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  submitContact,
};
