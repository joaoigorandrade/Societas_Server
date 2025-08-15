const { db } = require('config/firebaseConfig');

const createTask = async (req, res) => {
  console.log('Request body in createTask:', req.body);
  try {
    const { userId, boardId } = req.params;
    const { description, status, creator_id, assignee_id, related_task_id, result } = req.body;

    const newTask = {
      description: description,
      status: status,
      creator_id: creator_id,
      assignee_id: assignee_id,
      created_at: new Date().toISOString(),
    };

    if (req.body.hasOwnProperty('related_task_id')) {
      newTask.related_task_id = related_task_id;
    }

    if (req.body.hasOwnProperty('result')) {
      newTask.result = result;
    }

    const docRef = await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').add(newTask);
    res.status(201).send({ id: docRef.id, ...newTask });
  } catch (error) {
    res.status(500).send({ message: 'Error creating task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { userId, boardId, taskId } = req.params;
    await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').doc(taskId).delete();
    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting task', error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { userId, boardId } = req.params;
    const snapshot = await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send({ message: 'Error getting all tasks', error: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { userId, boardId, taskId } = req.params;
    const taskDoc = await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.status(200).json({ id: taskDoc.id, ...taskDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error getting task', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { userId, boardId, taskId } = req.params;
    const data = req.body;
    await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').doc(taskId).update(data);
    const updatedDoc = await db.collection('users').doc(userId).collection('boards').doc(boardId).collection('tasks').doc(taskId).get();
    res.status(200).send({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error updating task', error: error.message });
  }
};

module.exports = {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
};
