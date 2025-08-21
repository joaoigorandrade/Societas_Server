const express = require('express');
const router = express.Router({ mergeParams: true });
const chatController = require('../../controllers/chats');
const messageRoutes = require('../Messages/messages');

// Nested routes for messages and message statuses within a chat
router.use('/:chatId/messages', messageRoutes);


// Chat routes
router.get('/', chatController.getAllChats);
router.post('/', chatController.createChat);
router.get('/:chatId', chatController.getChatById);
router.get('/with/:agentId', chatController.getChatWithAgent);

router.delete('/:chatId', chatController.deleteChat);

module.exports = router;