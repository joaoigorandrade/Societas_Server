const { db } = require('../../config/firebaseConfig');

const createMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender_id, content } = req.body;
    const newMessage = {
      sender_id,
      content,
      timestamp: new Date().toISOString(),
    };
    const docRef = await db.collection('chats').doc(chatId).collection('messages').add(newMessage);
    res.status(201).send({ id: docRef.id, ...newMessage });
  } catch (error) {
    res.status(500).send({ message: 'Error creating message', error: error.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const snapshot = await db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp').get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send({ message: 'Error getting all messages', error: error.message });
  }
};

const getMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const messageDoc = await db.collection('chats').doc(chatId).collection('messages').doc(messageId).get();
    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found' });
    }
    res.status(200).json({ id: messageDoc.id, ...messageDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error getting message', error: error.message });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessage,
};
