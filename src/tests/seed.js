const { db } = require('../config/firebaseConfig');
const generateMockUser = require('./mock-data/users');
const generateMockAgent = require('./mock-data/agents');
const generateMockBoard = require('./mock-data/boards');
const generateMockTask = require('./mock-data/tasks');
const generateMockChat = require('./mock-data/chats');
const generateMockMessage = require('./mock-data/messages');

const seedDatabase = async ({ numUsers = 1, agentsPerUser = 3, boardsPerUser = 1, tasksPerBoard = 5, chatsPerUser = 3, messagesPerChat = 10 }) => {
  console.log('Starting database seed...');

  try {
    // --- Create Users ---
    console.log(`Creating ${numUsers} users...`);
    const userPromises = [];
    for (let i = 0; i < numUsers; i++) {
      const userData = generateMockUser();
      userPromises.push(db.collection('users').add(userData));
    }
    const userRefs = await Promise.all(userPromises);
    const userIds = userRefs.map(ref => ref.id);
    console.log(`${userIds.length} users created:`, userIds);

    // --- Create Sub-collections for each User ---
    for (const userId of userIds) {
      console.log(`
--- Populating sub-collections for user ${userId} ---`);
      const mainBatch = db.batch();
      const chatRefs = [];
      const agentRefs = [];

      // Create Agents
      for (let i = 0; i < agentsPerUser; i++) {
        const agentData = generateMockAgent();
        const agentRef = db.collection('users').doc(userId).collection('agents').doc();
        mainBatch.set(agentRef, agentData);
        agentRefs.push(agentRef);
      }

      // Create Boards and their Tasks
      for (let i = 0; i < boardsPerUser; i++) {
        const boardData = generateMockBoard();
        const boardRef = db.collection('users').doc(userId).collection('boards').doc();
        mainBatch.set(boardRef, boardData);

        for (let j = 0; j < tasksPerBoard; j++) {
          const taskData = generateMockTask(userIds);
          const taskRef = boardRef.collection('tasks').doc();
          mainBatch.set(taskRef, taskData);
        }
      }

      // Create Chats (without messages)
      for (let i = 0; i < chatsPerUser; i++) {
        const agentId = agentRefs[i % agentsPerUser].id;
        const participants = [userId, agentId];
        const chatData = generateMockChat(participants);
        const chatRef = db.collection('users').doc(userId).collection('chats').doc();
        mainBatch.set(chatRef, chatData);
        chatRefs.push({ ref: chatRef, participants });
      }
      
      await mainBatch.commit();
      console.log(`✅ Agents, boards, tasks, and chats for user ${userId} committed.`);

      // --- Create Messages for the newly created Chats ---
      console.log(`Creating messages for ${chatRefs.length} chats...`);
      const messageBatch = db.batch();
      for (const chat of chatRefs) {
        console.log(`  - Adding messages for chat ID: ${chat.ref.id}`);
        for (let j = 0; j < messagesPerChat; j++) {
          const messageData = generateMockMessage(chat.participants);
          const messageRef = chat.ref.collection('messages').doc();
          console.log(`    - Message data:`, JSON.stringify(messageData, null, 2));
          messageBatch.set(messageRef, messageData);
        }
      }
      
      await messageBatch.commit();
      console.log(`✅ Message batch for user ${userId} committed.`);
    }

    console.log('\nDatabase seed complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

const clearDatabase = async () => {
  console.log('Clearing database...');
  const collections = await db.listCollections();
  for (const collection of collections) {
    const docs = await collection.listDocuments();
    for (const doc of docs) {
      await doc.delete({ recursive: true });
    }
  }
  console.log('Database cleared.');
};

module.exports = { seedDatabase, clearDatabase };
