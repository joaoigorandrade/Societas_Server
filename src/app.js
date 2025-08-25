const express = require('express');
const logger = require('./api/middleware/logger');
const app = express();
app.use(express.json());
app.use(logger);

const homeRoutes = require('./api/routes/Home/home');
const usersRoutes = require('./api/routes/Users/users');
const authRoutes = require('./api/routes/Auth/auth');
const errorHandler = require('./api/middleware/errorHandler');

app.use('/home', homeRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
