const { faker } = require('@faker-js/faker');

const generateMockAgent = () => ({
  name: faker.person.fullName(),
  settings: {
    search_engine: faker.helpers.arrayElement(['google', 'bing', 'duckduckgo']),
  },
  board: faker.string.uuid(),
  tasks: [faker.string.uuid(), faker.string.uuid()],
  subAgents: [faker.string.uuid()],
  documents: [faker.string.uuid(), faker.string.uuid()],
  memory: faker.helpers.arrayElement(['long-term', 'short-term']),
  status: faker.helpers.arrayElement(['active', 'idle', 'offline']),
  created_at: faker.date.recent(),
  capabilities: faker.helpers.arrayElements(['search', 'summarize', 'chat']),
  department: faker.commerce.department(),
});

module.exports = generateMockAgent;
