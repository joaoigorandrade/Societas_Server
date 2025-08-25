// Mock modules before they are imported
jest.mock('axios');
jest.mock('firebase-admin');
jest.mock('../config/firebaseConfig');

// Mock axios responses
const axios = require('axios');
axios.post.mockImplementation((url, data) => {
  if (url.includes('signInWithPassword')) {
    return Promise.resolve({
      data: {
        idToken: 'mock-id-token',
        refreshToken: 'mock-refresh-token',
        localId: 'test-uid-123',
        email: data.email,
        displayName: 'Test User'
      }
    });
  }
  
  if (url.includes('token')) {
    return Promise.resolve({
      data: {
        id_token: 'new-mock-id-token',
        refresh_token: 'new-mock-refresh-token',
        user_id: 'test-uid-123'
      }
    });
  }
  
  return Promise.reject(new Error('Unexpected URL'));
});

// Mock Firebase Admin SDK
const firebaseAdmin = require('firebase-admin');
firebaseAdmin.auth = jest.fn().mockReturnValue({
  createUser: jest.fn().mockResolvedValue({
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: false
  }),
  getUser: jest.fn().mockResolvedValue({
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: false
  }),
  getUserByEmail: jest.fn().mockResolvedValue({
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: false
  }),
  createCustomToken: jest.fn().mockResolvedValue('mock-custom-token'),
  verifyIdToken: jest.fn().mockResolvedValue({
    uid: 'test-uid-123',
    email: 'test@example.com',
    email_verified: false
  })
});

firebaseAdmin.firestore = {
  FieldValue: {
    serverTimestamp: jest.fn().mockReturnValue('mock-timestamp')
  }
};

// Mock Firestore database
const firebaseConfig = require('../config/firebaseConfig');
firebaseConfig.db = {
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      set: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          uid: 'test-uid-123',
          email: 'test@example.com',
          displayName: 'Test User',
          emailVerified: false,
          createdAt: 'mock-timestamp',
          updatedAt: 'mock-timestamp'
        })
      }),
      update: jest.fn().mockResolvedValue()
    })
  })
};
