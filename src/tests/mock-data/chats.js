const { faker } = require('@faker-js/faker');

const generateMockChat = (userIds) => ({
  participants: userIds,
  summary: faker.lorem.sentence(),
  created_at: faker.date.recent(),
  last_message: faker.lorem.sentence(),
});

module.exports = generateMockChat;
