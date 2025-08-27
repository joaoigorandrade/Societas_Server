const {db} = require('../../config/firebaseConfig');

const createTask = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { boardId } = req.params;
    const { creator, assignee, description, status, weight, related, result } = req.body;
    const taskRef = await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').add({
      creator,
      assignee,
      description,
      status,
      weight,
      related,
      result,
      createdAt: new Date().toISOString(),
    });
    res.status(201).send({ id: taskRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllTasks = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { boardId } = req.params;
    const tasksSnapshot = await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').get();
    const tasks = [];
    tasksSnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getTaskById = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { boardId, taskId } = req.params;
    const taskDoc = await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      res.status(404).send('Task not found');
    } else {
      res.status(200).send({ id: taskDoc.id, ...taskDoc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateTask = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { boardId, taskId } = req.params;
    const { creator, assignee, description, status, weight, related, result } = req.body;
    await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').doc(taskId).update({
      creator,
      assignee,
      description,
      status,
      weight,
      related,
      result,
    });
    res.status(200).send('Task updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteTask = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { boardId, taskId } = req.params;
    await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').doc(taskId).delete();
    res.status(200).send('Task deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};