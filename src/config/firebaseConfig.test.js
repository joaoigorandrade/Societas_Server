// Mock Firebase Admin SDK for testing
const mockFirebaseAdmin = {
  auth: () => ({
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
  }),
  firestore: {
    FieldValue: {
      serverTimestamp: jest.fn().mockReturnValue('mock-timestamp')
    }
  }
};

// Mock Firestore database
const mockDb = {
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

// Mock the entire firebase-admin module
jest.mock('firebase-admin', () => mockFirebaseAdmin);

module.exports = { 
  db: mockDb,
  admin: mockFirebaseAdmin 
};
