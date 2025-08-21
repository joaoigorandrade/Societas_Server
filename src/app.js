const express = require('express');
const app = express();
app.use(express.json());

const homeRoutes = require('./api/routes/Home/home');
const usersRoutes = require('./api/routes/Users/users');

app.use('/home', homeRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
