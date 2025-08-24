const {db} = require('../../config/firebaseConfig');
const { GoogleGenAI } = require("@google/genai");

const createMessage = async (req, res, next) => {
  try {
    const { userId, chatId } = req.params;
    const { message, agentId } = req.body;

    if (!message || !agentId) {
      const err = new Error('Bad Request: message and agentId are required.');
      err.statusCode = 400;
      throw err;
    }

    const aiResponse = await getAiResponse(message);

    const batch = db.batch();
    const chatRef = db.collection('users').doc(userId).collection('chats').doc(chatId);
    const messagesRef = chatRef.collection('messages');

    const userMessageRef = messagesRef.doc();
    batch.set(userMessageRef, {
      sender: userId,
      content: message,
      time: new Date().toISOString(),
    });

    const aiMessageRef = messagesRef.doc();
    batch.set(aiMessageRef, {
      sender: agentId,
      content: aiResponse,
      time: new Date().toISOString(),
    });

    batch.update(chatRef, {
      last_message: aiResponse,
    });

    await batch.commit();

    res.status(201).send({
      userMessageId: userMessageRef.id,
      aiMessageId: aiMessageRef.id,
    });
  } catch (error) {
    next(error);
  }
};

async function getAiResponse(contents) {
  const genAI = new GoogleGenAI({});
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: "You are a CFO of a enterprise named Societas, you are responding in the enterprise chat dont be to much detailed",
    },
  });
  return response.text;
}

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