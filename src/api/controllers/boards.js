const {db} = require('../../config/firebaseConfig');

const createBoard = async (req, res) => {
  try {
    const { userId } = req.params;
    const { description, summary, finish_pc } = req.body;
    const boardRef = await db.collection('users').doc(userId).collection('boards').add({
      description,
      summary,
      finish_pc,
      createdAt: new Date().toISOString(),
    });
    res.status(201).send({ id: boardRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllBoards = async (req, res) => {
  try {
    const { userId } = req.params;
    const boardsSnapshot = await db.collection('users').doc(userId).collection('boards').get();
    const boards = [];
    boardsSnapshot.forEach((doc) => {
      boards.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(boards);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getBoardById = async (req, res) => {
  try {
    const { userId, boardId } = req.params;
    const boardDoc = await db.collection('users').doc(userId).collection('boards').doc(boardId).get();
    if (!boardDoc.exists) {
      res.status(404).send('Board not found');
    } else {
      res.status(200).send({ id: boardDoc.id, ...boardDoc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateBoard = async (req, res) => {
  try {
    const { userId, boardId } = req.params;
    const { description, summary, finish_pc } = req.body;
    await db.collection('users').doc(userId).collection('boards').doc(boardId).update({
      description,
      summary,
      finish_pc,
    });
    res.status(200).send('Board updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { userId, boardId } = req.params;
    await db.collection('users').doc(userId).collection('boards').doc(boardId).delete();
    res.status(200).send('Board deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};