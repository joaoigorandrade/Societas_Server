const express = require('express');
const router = express.Router({ mergeParams: true });
const chatController = require('../../controllers/chats');
const messageRoutes = require('../Messages/messages');
const messageStatusRoutes = require('../Messages/messageStatus');

// Nested routes for messages and message statuses within a chat
router.use('/:chatId/messages', messageRoutes);
router.use('/:chatId/message_status', messageStatusRoutes);

// Chat routes
router.get('/', chatController.getAllChats);
router.post('/', chatController.createChat);
router.get('/:chatId', chatController.getChat);
router.put('/:chatId', chatController.updateChat);
router.delete('/:chatId', chatController.deleteChat);

module.exports = router;