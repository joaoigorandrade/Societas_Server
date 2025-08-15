const { faker } = require('@faker-js/faker');

const generateMockBoard = () => ({
  description: faker.lorem.sentence(),
  summary: faker.lorem.paragraph(),
  finish_pc: faker.number.int({ min: 0, max: 100 }),
  created_at: faker.date.recent(),
});

module.exports = generateMockBoard;
