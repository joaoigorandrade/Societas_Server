const admin = require('firebase-admin');
const axios = require('axios');
const { db } = require('../../config/firebaseConfig');

// Firebase Auth REST API configuration
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;

/**
 * User sign up endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    email: !email ? 'Email are required' : null,
                    password: !password ? 'Password are required' : null
                }
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: {
                    email: 'Invalid email format',
                    password: null
                }
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: {
                    email: null,
                    password: 'Password must be at least 6 characters long'
                }
            });
        }

        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: false
        });

        const userData = {
            uid: userRecord.uid,
            email: userRecord.email,
            emailVerified: userRecord.emailVerified,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('users').doc(userRecord.uid).set(userData);

        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        const safeUserData = {
            uid: userRecord.uid,
            email: userRecord.email,
            emailVerified: userRecord.emailVerified,
            createdAt: userData.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: safeUserData,
                token: customToken
            }
        });

    } catch (error) {
        console.error('Sign up error:', error);

        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({
                success: false,
                error: {
                    email: 'User with this email already exists',
                    password: null
                }
            });
        }

        if (error.code === 'auth/invalid-email') {
            return res.status(400).json({
                success: false,
                error: {
                    email:  'Invalid email address',
                    password: null
                }
            });
        }

        if (error.code === 'auth/weak-password') {
            return res.status(400).json({
                success: false,
                error: {
                    email:  null,
                    password: 'Password is too weak'
                }
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during sign up'
        });
    }
};

/**
 * User sign in endpoint using Firebase Auth REST API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null
                }
            });
        }

        // Use Firebase Auth REST API for sign in
        const signInResponse = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        const { idToken, refreshToken, localId, email: userEmail } = signInResponse.data;

        // Get user data from Firestore
        console.log(localId)
        const userDoc = await db.collection('users').doc(localId).get();

        if (!userDoc.exists) {
            return res.status(401).json({
                success: false,
                error: {
                    email: 'User account not found',
                    password: null
                }
            });
        }

        const userData = userDoc.data();

        // Update last login timestamp
        await db.collection('users').doc(localId).update({
            lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Return safe user data
        const safeUserData = {
            uid: localId,
            email: userEmail,
            emailVerified: userData.emailVerified,
            createdAt: userData.createdAt,
            lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
        };

        res.status(200).json({
            success: true,
            message: 'Sign in successful',
            data: {
                user: safeUserData,
                token: idToken,
                refreshToken: refreshToken
            }
        });

    } catch (error) {
        console.error('Sign in error:', error);

        // Handle Firebase Auth REST API errors
        if (error.response && error.response.data) {
            const firebaseError = error.response.data.error;

            if (firebaseError.code === 400) {
                if (firebaseError.message.includes('INVALID_PASSWORD') || firebaseError.message.includes('EMAIL_NOT_FOUND')) {
                    return res.status(401).json({
                        success: false,
                        error: {
                            email: 'Invalid email or password',
                            password: 'Invalid email or password'
                        }
                    });
                }

                if (firebaseError.message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
                    return res.status(429).json({
                        success: false,
                        error: {
                            email: 'Too many failed attempts. Please try again later.',
                            password: 'Too many failed attempts. Please try again later.'
                        }
                    });
                }
            }
        }

        res.status(500).json({
            success: false,
            error: {
                email: 'Internal server error during sign in',
                password: 'Internal server error during sign in'
            }
        });
    }
};

/**
 * Refresh token endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken: refreshTokenFromBody } = req.body;

        if (!refreshTokenFromBody) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Use Firebase Auth REST API to refresh token
        const refreshResponse = await axios.post(
            `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
            {
                grant_type: 'refresh_token',
                refresh_token: refreshTokenFromBody
            }
        );

        const { id_token, refresh_token, user_id } = refreshResponse.data;

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token: id_token,
                refreshToken: refresh_token
            }
        });

    } catch (error) {
        console.error('Token refresh error:', error);

        if (error.response && error.response.data && error.response.data.error) {
            const firebaseError = error.response.data.error;

            if (firebaseError.message.includes('TOKEN_EXPIRED')) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token has expired'
                });
            }
        }

        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};

/**
 * Verify user token endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        // Verify the token
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Get user data
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userData = userDoc.data();

        // Return safe user data
        const safeUserData = {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            emailVerified: userRecord.emailVerified,
            createdAt: userData.createdAt,
            lastLoginAt: userData.lastLoginAt
        };

        res.status(200).json({
            success: true,
            message: 'Token verified successfully',
            data: {
                user: safeUserData
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        if (error.code === 'auth/id-token-revoked') {
            return res.status(401).json({
                success: false,
                message: 'Token has been revoked'
            });
        }

        if (error.code === 'auth/invalid-id-token') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during token verification'
        });
    }
};

/**
 * Sign out endpoint (client-side token invalidation)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signOut = async (req, res) => {
    try {
        // Note: Firebase tokens are stateless, so server-side invalidation
        // requires additional setup. This endpoint is mainly for logging purposes.

        res.status(200).json({
            success: true,
            message: 'Sign out successful. Please discard your tokens on the client side.'
        });

    } catch (error) {
        console.error('Sign out error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during sign out'
        });
    }
};

module.exports = {
    signUp,
    signIn,
    signOut,
    refreshToken,
    verifyToken
};
