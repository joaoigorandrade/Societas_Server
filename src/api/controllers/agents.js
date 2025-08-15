const { db } = require('config/firebaseConfig');

const createAgent = async (req, res) => {
  try {
    const { userId } = req.params;
    const { agent_id, name, description, avatar_url, capabilities, settings_template } = req.body;
    if (!agent_id) {
      return res.status(400).send({ message: 'Agent ID (agent_id) is required in the request body.' });
    }
    const agentRef = db.collection('users').doc(userId).collection('agents').doc(agent_id);
    const doc = await agentRef.get();
    if (doc.exists) {
        return res.status(409).send({ message: 'Agent already exists.' });
    }
    const newAgent = {
      name,
    };
    if (description) newAgent.description = description;
    if (avatar_url) newAgent.avatar_url = avatar_url;
    if (capabilities) newAgent.capabilities = capabilities;
    if (settings_template) newAgent.settings_template = settings_template;

    await agentRef.set(newAgent);
    res.status(201).send({ id: agent_id, ...newAgent });
  } catch (error) {
    res.status(500).send({ message: 'Error creating agent', error: error.message });
  }
};

const createSubAgent = async (req, res) => {
  try {
    const { userId, agentId } = req.params;
    const { subagent_id, name, description, avatar_url, capabilities, settings_template } = req.body;
    if (!subagent_id) {
      return res.status(400).send({ message: 'Subagent ID (subagent_id) is required in the request body.' });
    }
    const subAgentRef = db.collection('users').doc(userId).collection('agents').doc(agentId).collection('subagents').doc(subagent_id);
    const doc = await subAgentRef.get();
    if (doc.exists) {
        return res.status(409).send({ message: 'Sub-agent already exists.' });
    }
    const newSubAgent = {
      name,
    };
    if (description) newSubAgent.description = description;
    if (avatar_url) newSubAgent.avatar_url = avatar_url;
    if (capabilities) newSubAgent.capabilities = capabilities;
    if (settings_template) newSubAgent.settings_template = settings_template;

    await subAgentRef.set(newSubAgent);
    res.status(201).send({ id: subagent_id, ...newSubAgent });
  } catch (error) {
    res.status(500).send({ message: 'Error creating sub-agent', error: error.message });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const { userId, agentId } = req.params;
    const agentRef = db.collection('users').doc(userId).collection('agents').doc(agentId);
    const doc = await agentRef.get();
    if (!doc.exists) {
      return res.status(404).send({ message: 'Agent not found' });
    }
    await agentRef.delete();
    res.status(200).send({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting agent', error: error.message });
  }
};

const getAgent = async (req, res) => {
  try {
    const { userId, agentId } = req.params;
    const agentDoc = await db.collection('users').doc(userId).collection('agents').doc(agentId).get();
    if (!agentDoc.exists) {
      return res.status(404).send({ message: 'Agent not found' });
    }
    res.status(200).json({ id: agentDoc.id, ...agentDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error getting agent', error: error.message });
  }
};

const getAllAgents = async (req, res) => {
  try {
    const { userId } = req.params;
    const agentsSnapshot = await db.collection('users').doc(userId).collection('agents').get();
    const agents = agentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).send({ message: 'Error getting agents', error: error.message });
  }
};

const updateAgent = async (req, res) => {
  try {
    const { userId, agentId } = req.params;
    const { name, description, avatar_url, capabilities, settings_template } = req.body;
    const agentRef = db.collection('users').doc(userId).collection('agents').doc(agentId);
    const doc = await agentRef.get();
    if (!doc.exists) {
      return res.status(404).send({ message: 'Agent not found' });
    }
    const updatedAgent = {};
    if (name) updatedAgent.name = name;
    if (description) updatedAgent.description = description;
    if (avatar_url) updatedAgent.avatar_url = avatar_url;
    if (capabilities) updatedAgent.capabilities = capabilities;
    if (settings_template) updatedAgent.settings_template = settings_template;

    await agentRef.update(updatedAgent);
    res.status(200).send({ id: agentId, ...updatedAgent });
  } catch (error) {
    res.status(500).send({ message: 'Error updating agent', error: error.message });
  }
};

module.exports = {
  createAgent,
  createSubAgent,
  deleteAgent,
  getAgent,
  getAllAgents,
  updateAgent,
};
