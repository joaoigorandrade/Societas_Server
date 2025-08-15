const express = require('express');
const router = express.Router({ mergeParams: true });
const messageStatusController = require('../../controllers/messageStatus');

// Get all message statuses for a specific chat
router.get('/', messageStatusController.getAllMessageStatuses);

// Get a message status by user ID
router.get('/:userId', messageStatusController.getMessageStatus);

// Set a message status by user ID
router.put('/:userId', messageStatusController.setMessageStatus);

module.exports = router;
