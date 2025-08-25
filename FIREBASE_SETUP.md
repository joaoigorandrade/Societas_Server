# Firebase Authentication Setup Guide

## Prerequisites

1. A Firebase project with Authentication enabled
2. Firebase Admin SDK service account key
3. Firebase Web API key

## Configuration Steps

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication in the Firebase console
4. Go to Authentication > Sign-in method
5. Enable Email/Password authentication

### 2. Get Firebase API Key

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. If you don't have a web app, click "Add app" and select Web
4. Copy the `apiKey` from the config object

### 3. Get Firebase Admin SDK Service Account

1. Go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Place it in `src/config/firebase-api-key.json`

### 4. Environment Variables

Create a `.env` file in your project root with:

```bash
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

### 5. Update Firebase Config

Make sure your `src/config/firebaseConfig.js` points to the correct service account file.

## Security Considerations

- Never commit your `firebase-api-key.json` to version control
- Add `*.json` to your `.gitignore` file
- Use environment variables for sensitive configuration
- Implement rate limiting for authentication endpoints
- Consider implementing IP-based blocking for failed attempts

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signout` - User sign out
- `POST /api/auth/refresh` - Refresh authentication token
- `POST /api/auth/verify` - Verify user token

### Protected Routes

Use the `authenticateToken` middleware to protect routes:

```javascript
const { authenticateToken } = require('../middleware/auth');

router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains authenticated user info
  res.json({ user: req.user });
});
```

## Testing

You can test the endpoints using tools like Postman or curl:

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"Test User"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
