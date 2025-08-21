const express = require('express');
const app = express();
app.use(express.json());

const messageStatusRoutes = require('./api/routes/Messages/messageStatus');
app.use('/api/users/', messageStatusRoutes);

const homeRoutes = require('./api/routes/Home/home');
app.use('/home', homeRoutes);

module.exports = app;