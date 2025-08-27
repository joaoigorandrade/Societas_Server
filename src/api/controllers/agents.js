const {db} = require('../../config/firebaseConfig');

const createAgent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { name, settings, board, tasks, subAgents, documents, memory, status, capabilities, department } = req.body;
    const agentRef = await db.collection('users').doc(userId).collection('agents').add({
      name,
      settings,
      board,
      tasks,
      subAgents,
      documents,
      memory,
      status,
      capabilities,
      department,
      createdAt: new Date().toISOString(),
    });
    res.status(201).send({ id: agentRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllAgents = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const agentsSnapshot = await db.collection('users').doc(userId).collection('agents').get();
    const agents = [];
    agentsSnapshot.forEach((doc) => {
      agents.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(agents);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAgentById = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { agentId } = req.params;
    const agentDoc = await db.collection('users').doc(userId).collection('agents').doc(agentId).get();
    if (!agentDoc.exists) {
      res.status(404).send('Agent not found');
    } else {
      res.status(200).send({ id: agentDoc.id, ...agentDoc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateAgent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { agentId } = req.params;
    const { name, settings, board, tasks, subAgents, documents, memory, status, capabilities, department } = req.body;
    await db.collection('users').doc(userId).collection('agents').doc(agentId).update({
      name,
      settings,
      board,
      tasks,
      subAgents,
      documents,
      memory,
      status,
      capabilities,
      department,
    });
    res.status(200).send('Agent updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteAgent = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { agentId } = req.params;
    await db.collection('users').doc(userId).collection('agents').doc(agentId).delete();
    res.status(200).send('Agent deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
};