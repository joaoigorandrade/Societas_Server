# Authentication System Documentation

## Overview

This authentication system provides secure user registration, login, and token management using Firebase Authentication. It includes comprehensive security measures and follows best practices for protecting user data.

## Features

- **User Registration**: Secure user signup with email validation and password strength requirements
- **User Authentication**: Secure login using Firebase Auth REST API
- **Token Management**: JWT token generation, verification, and refresh capabilities
- **Security**: Input validation, error handling, and secure data transmission
- **Middleware**: Authentication middleware for protecting routes

## Security Features

### 1. Input Validation
- Email format validation using regex
- Password strength requirements (minimum 6 characters)
- Required field validation
- XSS protection through proper input sanitization

### 2. Error Handling
- Generic error messages to prevent information leakage
- Specific error codes for different failure scenarios
- Comprehensive logging for debugging and monitoring

### 3. Data Protection
- No sensitive information returned in responses
- Secure token generation and verification
- User data sanitization before transmission

### 4. Rate Limiting Ready
- The system is designed to work with rate limiting middleware
- Consider implementing IP-based blocking for failed attempts

## API Endpoints

### 1. User Registration
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "displayName": "John Doe" // optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "uid": "firebase_uid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "emailVerified": false,
      "createdAt": "timestamp"
    },
    "token": "jwt_token"
  }
}
```

### 2. User Authentication
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sign in successful",
  "data": {
    "user": {
      "uid": "firebase_uid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "emailVerified": false,
      "createdAt": "timestamp",
      "lastLoginAt": "timestamp"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 3. Token Verification
```http
POST /api/auth/verify
Content-Type: application/json

{
  "token": "jwt_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token verified successfully",
  "data": {
    "user": {
      "uid": "firebase_uid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "emailVerified": false,
      "createdAt": "timestamp",
      "lastLoginAt": "timestamp"
    }
  }
}
```

### 4. Token Refresh
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 5. User Sign Out
```http
POST /api/auth/signout
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sign out successful. Please discard your tokens on the client side."
}
```

## Error Responses

### Validation Errors (400 Bad Request)
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### Authentication Errors (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Conflict Errors (409 Conflict)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Server Errors (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error during sign up"
}
```

## Using Authentication Middleware

### Protect Routes
```javascript
const { authenticateToken } = require('../middleware/auth');

// Protected route example
router.get('/profile', authenticateToken, (req, res) => {
  // req.user contains authenticated user info
  const { uid, email, emailVerified } = req.user;
  
  res.json({
    success: true,
    data: { uid, email, emailVerified }
  });
});
```

### Optional Authentication
```javascript
const { optionalAuth } = require('../middleware/auth');

// Route that works with or without authentication
router.get('/public', optionalAuth, (req, res) => {
  if (req.user) {
    // User is authenticated
    res.json({ authenticated: true, user: req.user });
  } else {
    // User is not authenticated
    res.json({ authenticated: false });
  }
});
```

## Client-Side Implementation

### 1. Store Tokens Securely
```javascript
// Store tokens in memory or secure storage
const storeTokens = (token, refreshToken) => {
  // For web apps, consider using httpOnly cookies
  // For mobile apps, use secure storage
  localStorage.setItem('authToken', token);
  localStorage.setItem('refreshToken', refreshToken);
};
```

### 2. Include Token in Requests
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response;
};
```

### 3. Handle Token Expiration
```javascript
const handleTokenExpiration = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    const data = await response.json();
    
    if (data.success) {
      storeTokens(data.data.token, data.data.refreshToken);
      return data.data.token;
    }
  } catch (error) {
    // Redirect to login
    window.location.href = '/login';
  }
};
```

## Testing

Run the authentication tests:

```bash
npm test src/tests/auth.test.js
```

## Security Best Practices

1. **Never store sensitive data in localStorage** - Use httpOnly cookies or secure storage
2. **Implement HTTPS** - Always use HTTPS in production
3. **Set appropriate token expiration** - Configure Firebase token expiration
4. **Monitor authentication attempts** - Log and monitor failed login attempts
5. **Implement rate limiting** - Prevent brute force attacks
6. **Regular security audits** - Review authentication logs and security measures

## Troubleshooting

### Common Issues

1. **Firebase configuration errors**: Ensure your service account key is properly configured
2. **Token verification failures**: Check token expiration and format
3. **CORS issues**: Configure CORS properly for your frontend domain
4. **Environment variables**: Ensure all required environment variables are set

### Debug Mode

Enable debug logging by setting the log level in your environment:

```bash
DEBUG=auth:* npm start
```

## Support

For issues and questions:
1. Check the Firebase documentation
2. Review the error logs
3. Verify your configuration
4. Test with the provided test suite
