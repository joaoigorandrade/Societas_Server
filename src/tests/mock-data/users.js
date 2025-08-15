const { faker } = require('@faker-js/faker');

const generateMockUser = () => ({
  uid: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar_url: faker.image.avatar(),
  enterprise: faker.company.name(),
  settings: {
    theme: faker.helpers.arrayElement(['dark', 'light']),
    notifications: faker.datatype.boolean(),
  },
});

module.exports = generateMockUser;
