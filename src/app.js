const express = require('express');
const app = express();
app.use(express.json());

const usersRoutes = require('./api/routes/Users/users');
app.use('/api/users', usersRoutes);

module.exports = app;