const express = require('express');
const logger = require('./api/middleware/logger');
const { validateUserId } = require('./api/middleware/auth');
const app = express();
app.use(express.json());
app.use(logger);

const homeRoutes = require('./api/routes/Home/home');
const usersRoutes = require('./api/routes/Users/users');
const authRoutes = require('./api/routes/Auth/auth');
const errorHandler = require('./api/middleware/errorHandler');

app.use('/home', validateUserId, homeRoutes);
app.use('/api/users', validateUserId, usersRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
