const express = require('express');
const router = express.Router({ mergeParams: true });
const messageController = require('../../controllers/messages');

// Get all messages for a specific chat
router.get('/', messageController.getAllMessages);

// Create a new message for a specific chat
router.post('/', messageController.createMessage);

// Get a single message by ID


module.exports = router;