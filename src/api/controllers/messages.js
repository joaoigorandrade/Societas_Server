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

    const batch = db.batch();
    const chatRef = db.collection('users').doc(userId).collection('chats').doc(chatId);
    const messagesRef = chatRef.collection('messages');

    const userMessageRef = messagesRef.doc();
    batch.set(userMessageRef, {
      sender: userId,
      content: message,
      time: new Date().toISOString(),
    });

    const history = await getHistory(userId, agentId, chatId);
    const aiResponse = await getAiResponse(history, message);

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
      status: 201,
      userMessageId: userMessageRef.id,
      aiMessageId: aiMessageRef.id,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

async function getAiResponse(history, contents) {
  const genAI = new GoogleGenAI({});
  const chat = genAI.chats.create({
    model: "gemini-2.5-flash",
    config: {
      thinkingConfig: 0,
      systemInstruction: "You are a CFO of a enterprise named Societas, you are responding in the enterprise chat dont be to much detailed",
    },
    history
  });
  const response = await chat.sendMessage({
    message: contents,
  });
  return response.text;
}

async function getHistory(userId, agentId, chatId) {
    const chatRef = db.collection('users').doc(userId).collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      const err = new Error('Chat not found.');
      err.statusCode = 404;
      throw err;
    }

    if (!agentId) {
      const err = new Error('Could not identify agent in this chat.');
      err.statusCode = 404;
      throw err;
    }

    const messagesSnapshot = await chatRef.collection('messages').orderBy('time', 'asc').get();

    const history = messagesSnapshot.docs.map(doc => {
      const message = doc.data();
      const role = message.sender === userId ? 'user' : 'model';
      return {
        role: role,
        parts: [{ text: message.content }],
      };
    });

    return history
};

const getAllMessages = async (req, res, next) => {
  try {
    const { userId, chatId } = req.params;
    
    const chatRef = db.collection('users').doc(userId).collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      const err = new Error('Chat not found.');
      err.statusCode = 404;
      throw err;
    }
    
    const participants = chatDoc.data().participants;
    const agentId = participants.find(p => p !== userId);

    const history = await getHistory(userId, agentId, chatId);
    res.status(200).send({ history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
};