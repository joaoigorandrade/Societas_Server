const axios = require('axios');
const { seed, clearDatabase } = require('./seed');

const API_BASE_URL = 'http://localhost:3000/api';

describe('API Tests', () => {
  beforeAll(async () => {
    await seed({ numUsers: 3 });
  });

  afterAll(async () => {
    await clearDatabase();
  });

  it('should get all users', async () => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(3);
  });
});
