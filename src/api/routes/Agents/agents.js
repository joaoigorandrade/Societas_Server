const express = require('express');
const router = express.Router({ mergeParams: true });
const agentController = require('../../controllers/agents');

// Agent routes
router.get('/', agentController.getAllAgents);
router.post('/', agentController.createAgent);
router.get('/:agentId', agentController.getAgent);
router.put('/:agentId', agentController.updateAgent);
router.delete('/:agentId', agentController.deleteAgent);

// Sub-agent routes
router.post('/:agentId/subagents', agentController.createSubAgent);

module.exports = router;