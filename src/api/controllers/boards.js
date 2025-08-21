const { db } = require('../../config/firebaseConfig');

const createBoard = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, summary, finish_pc, members } = req.body;
    const newBoard = {
      title,
      owner_id: userId,
      created_at: new Date().toISOString(),
    };
    if (description) newBoard.description = description;
    if (summary) newBoard.summary = summary;
    if (finish_pc) newBoard.finish_pc = finish_pc;
    if (members) newBoard.members = members;

    const docRef = await db.collection('users').doc(userId).collection('boards').add(newBoard);
    res.status(201).send({ id: docRef.id, ...newBoard });
  } catch (error) {
    res.status(500).send({ message: 'Error creating board', error: error.message });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { userId, boardId } = req.params;
    await db.collection('users').doc(userId).collection('boards').doc(boardId).delete();
    res.status(200).send({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting board', error: error.message });
  }
};

const getAllBoards = async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('users').doc(userId).collection('boards').get();
    const boards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).send({ message: 'Error getting all boards', error: error.message });
  }
};

const getBoard = async (req, res) => {
  try {
    const { userId, boardId } = req.params;
    const boardDoc = await db.collection('users').doc(userId).collection('boards').doc(boardId).get();
    if (!boardDoc.exists) {
      return res.status(404).send({ message: 'Board not found' });
    }
    res.status(200).json({ id: boardDoc.id, ...boardDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error getting board', error: error.message });
  }
};

const updateBoard = async (req, res) => {
  try {
    const { userId, boardId } = req.params;
    const data = req.body;
    await db.collection('users').doc(userId).collection('boards').doc(boardId).update(data);
    const updatedDoc = await db.collection('users').doc(userId).collection('boards').doc(boardId).get();
    res.status(200).send({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error updating board', error: error.message });
  }
};

module.exports = {
  createBoard,
  deleteBoard,
  getAllBoards,
  getBoard,
  updateBoard,
};
