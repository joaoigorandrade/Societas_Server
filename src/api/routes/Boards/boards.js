const express = require('express');
const router = express.Router({ mergeParams: true });
const boardController = require('../../controllers/boards');
const taskRoutes = require('./tasks');

// Nested routes for tasks within a board
router.use('/:boardId/tasks', taskRoutes);

// Board routes
router.get('/', boardController.getAllBoards);
router.post('/', boardController.createBoard);
router.get('/:boardId', boardController.getBoard);
router.put('/:boardId', boardController.updateBoard);
router.delete('/:boardId', boardController.deleteBoard);

module.exports = router;