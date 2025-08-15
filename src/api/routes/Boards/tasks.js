const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../../controllers/tasks');

// Get all tasks for a specific board
router.get('/', taskController.getAllTasks);

// Create a new task for a specific board
router.post('/', taskController.createTask);

// Get a single task by ID
router.get('/:taskId', taskController.getTask);

// Update a task by ID
router.put('/:taskId', taskController.updateTask);

// Delete a task by ID
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
