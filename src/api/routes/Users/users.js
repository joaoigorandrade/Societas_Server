const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');
const agentRoutes = require('../Agents/agents');
const chatRoutes = require('../Chats/chats');
const boardRoutes = require('../Boards/boards');

// User routes
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Agent routes
router.use('/:userId/agents', agentRoutes);

// Chat routes
router.use('/:userId/chats', chatRoutes);

// Board routes
router.use('/:userId/boards', boardRoutes);

module.exports = router;