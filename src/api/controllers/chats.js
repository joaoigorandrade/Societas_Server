const { db } = require('../../config/firebaseConfig');

const createChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const { members, last_message, members_info } = req.body;
    const newChat = {
      members,
      created_at: new Date().toISOString(),
    };
    if (last_message) newChat.last_message = last_message;
    if (members_info) newChat.members_info = members_info;

    const docRef = await db.collection('users').doc(userId).collection('chats').add(newChat);
    res.status(201).send({ id: docRef.id, ...newChat });
  } catch (error) {
    res.status(500).send({ message: 'Error creating chat', error: error.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    await db.collection('users').doc(userId).collection('chats').doc(chatId).delete();
    res.status(200).send({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting chat', error: error.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('users').doc(userId).collection('chats').get();
    const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).send({ message: 'Error getting all chats', error: error.message });
  }
};

const getChat = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    const chatDoc = await db.collection('users').doc(userId).collection('chats').doc(chatId).get();
    if (!chatDoc.exists) {
      return res.status(404).send({ message: 'Chat not found' });
    }
    res.status(200).json({ id: chatDoc.id, ...chatDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error getting chat', error: error.message });
  }
};

const updateChat = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    const data = req.body;
    await db.collection('users').doc(userId).collection('chats').doc(chatId).update(data);
    const updatedDoc = await db.collection('users').doc(userId).collection('chats').doc(chatId).get();
    res.status(200).send({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error updating chat', error: error.message });
  }
};

module.exports = {
  createChat,
  deleteChat,
  getAllChats,
  getChat,
  updateChat,
};
