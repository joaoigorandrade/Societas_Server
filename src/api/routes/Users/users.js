const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');
const agentRoutes = require('../Agents/agents');
const chatRoutes = require('../Chats/chats');
const boardRoutes = require('../Boards/boards');

// User routes
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

// User settings routes
router.get('/:userId/settings', userController.getUserSettings);
router.put('/:userId/settings', userController.updateUserSettings);

// Agent routes
router.use('/:userId/agents', agentRoutes);

// Chat routes
router.use('/:userId/chats', chatRoutes);

// Board routes
router.use('/:userId/boards', boardRoutes);

module.exports = router;