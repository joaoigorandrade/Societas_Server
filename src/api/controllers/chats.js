const db = require('../../config/firebaseConfig');

const createChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const { participants, summary, last_message } = req.body;
    const chatRef = await db.collection('users').doc(userId).collection('chats').add({
      participants,
      summary,
      last_message,
      createdAt: new Date().toISOString(),
    });
    res.status(201).send({ id: chatRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatsSnapshot = await db.collection('users').doc(userId).collection('chats').get();
    const chats = [];
    chatsSnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(chats);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getChatById = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    const chatDoc = await db.collection('users').doc(userId).collection('chats').doc(chatId).get();
    if (!chatDoc.exists) {
      res.status(404).send('Chat not found');
    } else {
      res.status(200).send({ id: chatDoc.id, ...chatDoc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteChat = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    await db.collection('users').doc(userId).collection('chats').doc(chatId).delete();
    res.status(200).send('Chat deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getChatWithAgent = async (req, res) => {
  try {
    const { userId, agentId } = req.params;
    const chatsRef = db.collection('users').doc(userId).collection('chats');
    const snapshot = await chatsRef.where('participants', 'array-contains', agentId).get();

    if (snapshot.empty) {
      return res.status(404).send('No chat found with this agent.');
    }

    const chats = [];
    snapshot.forEach(doc => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).send(chats[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createChat,
  getAllChats,
  getChatById,
  deleteChat,
  getChatWithAgent,
};