const axios = require('axios');
const { seed, clearDatabase } = require('./seed');

const API_BASE_URL = 'http://localhost:3000/api';

describe('API Tests', () => {
  let users;

  beforeAll(async () => {
    await seed({ numUsers: 3 });
    const response = await axios.get(`${API_BASE_URL}/users`);
    users = response.data;
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('Users', () => {
    it('should get all users', async () => {
      const response = await axios.get(`${API_BASE_URL}/users`);
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(3);
    });

    it('should create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        avatar: 'https://example.com/avatar.png',
        enterprise: 'Doe Inc.',
      };
      const response = await axios.post(`${API_BASE_URL}/users`, newUser);
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
    });

    it('should get a user by id', async () => {
      const userId = users[0].id;
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(userId);
    });

    it('should update a user', async () => {
      const userId = users[0].id;
      const updatedUser = {
        name: 'John Doe Updated',
      };
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, updatedUser);
      expect(response.status).toBe(200);
    });

    it('should delete a user', async () => {
      const userId = users[1].id;
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
      expect(response.status).toBe(200);
    });
  });

  describe('Agents', () => {
    it('should get all agents for a user', async () => {
      const userId = users[0].id;
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/agents`);
      expect(response.status).toBe(200);
    });
  });

  describe('Boards', () => {
    it('should get all boards for a user', async () => {
      const userId = users[0].id;
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/boards`);
      expect(response.status).toBe(200);
    });
  });

  describe('Chats', () => {
    it('should get all chats for a user', async () => {
      const userId = users[0].id;
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/chats`);
      expect(response.status).toBe(200);
    });
  });
});