const { faker } = require('@faker-js/faker');

const generateMockUser = () => ({
  name: faker.person.fullName(),
  avatar: faker.image.avatar(),
  enterprise: faker.company.name(),
});

module.exports = generateMockUser;