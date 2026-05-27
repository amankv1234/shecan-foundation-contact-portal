const express = require('express');
const router = express.Router();
const { getMessages, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMessages);
router.route('/:id').delete(protect, deleteMessage);

module.exports = router;
