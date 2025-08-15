const { faker } = require('@faker-js/faker');

const generateMockTask = (userIds) => ({
  description: faker.lorem.sentence(),
  status: faker.helpers.arrayElement(['To Do', 'In Progress', 'Done']),
  creator: faker.helpers.arrayElement(userIds),
  assigne: faker.helpers.arrayElement(userIds),
  weight: faker.number.int({ min: 1, max: 20 }),
  related: faker.string.uuid(),
  result: faker.lorem.sentence(),
});

module.exports = generateMockTask;
