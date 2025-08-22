const {db} = require('../../config/firebaseConfig');

const createMessage = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    const { message } = req.body;

    // 1. Create the new message
    const messageRef = await db.collection('users').doc(userId).collection('chats').doc(chatId).collection('messages').add({
      sender: userId,
      content: message,
      time: new Date().toISOString(),
    });

    // 2. Update the last_message in the parent chat document
    await db.collection('users').doc(userId).collection('chats').doc(chatId).update({
      last_message: messageRef,
    });

    res.status(201).send({ status: 201 });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    const messagesSnapshot = await db.collection('users').doc(userId).collection('chats').doc(chatId).collection('messages').get();
    const messages = [];
    messagesSnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
};