const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut, refreshToken, verifyToken } = require('../../controllers/auth');

/**
 * @route   POST /api/auth/signup
 * @desc    User registration
 * @access  Public
 */
router.post('/signup', signUp);

/**
 * @route   POST /api/auth/signin
 * @desc    User authentication
 * @access  Public
 */
router.post('/signin', signIn);

/**
 * @route   POST /api/auth/signout
 * @desc    User sign out
 * @access  Public
 */
router.post('/signout', signOut);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh authentication token
 * @access  Public
 */
router.post('/refresh', refreshToken);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify user token
 * @access  Public
 */
router.post('/verify', verifyToken);

module.exports = router;
