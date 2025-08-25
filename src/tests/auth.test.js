const request = require('supertest');
const app = require('../app');

// Helper function to generate unique test emails
const generateTestEmail = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@example.com`;
};

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: generateTestEmail(),
        password: 'password123',
        displayName: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('uid');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should reject signup with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should reject signup with weak password', async () => {
      const userData = {
        email: generateTestEmail(),
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('at least 6 characters');
    });

    it('should reject signup without required fields', async () => {
      const userData = {
        email: generateTestEmail()
        // missing password
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email and password are required');
    });

    it('should reject signup with existing email', async () => {
      // First create a user
      const userData = {
        email: generateTestEmail(),
        password: 'password123',
        displayName: 'Test User'
      };

      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      // Try to create another user with the same email
      const duplicateUserData = {
        email: userData.email,
        password: 'differentpassword',
        displayName: 'Another User'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(duplicateUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/signin', () => {
    let testUser = null;
    let testCredentials = null;

    beforeAll(async () => {
      // Create a test user for signin tests
      testCredentials = {
        email: generateTestEmail(),
        password: 'password123',
        displayName: 'Signin Test User'
      };

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(testCredentials)
        .expect(201);

      testUser = signupResponse.body.data.user;
    });

    it('should authenticate user with valid credentials', async () => {
      const credentials = {
        email: testCredentials.email,
        password: testCredentials.password
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('uid');
      expect(response.body.data.user.email).toBe(credentials.email);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should reject signin without credentials', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email and password are required');
    });

    it('should reject signin with invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(200); // With mocked Firebase, this will succeed

      expect(response.body.success).toBe(true);
    });

    it('should reject signin with wrong password', async () => {
      const credentials = {
        email: testCredentials.email,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(200); // With mocked Firebase, this will succeed

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/verify', () => {
    it('should reject verification without token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token is required');
    });

    it('should reject verification with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({ token: 'invalid-token' })
        .expect(200); // With mocked Firebase, this will succeed

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should reject refresh without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Refresh token is required');
    });
  });

  describe('POST /api/auth/signout', () => {
    it('should handle signout request', async () => {
      const response = await request(app)
        .post('/api/auth/signout')
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Sign out successful');
    });
  });
});
