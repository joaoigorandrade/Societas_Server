const { faker } = require('@faker-js/faker');

const generateMockMessage = (userIds) => ({
  sender: faker.helpers.arrayElement(userIds),
  content: faker.lorem.sentence(),
  time: faker.date.recent(),
  status: faker.helpers.arrayElement(['sent', 'delivered', 'read']),
});

module.exports = generateMockMessage;
