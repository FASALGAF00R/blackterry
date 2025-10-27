const express = require('express');
const app = express();

// middlewares,apis,routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require('./features/user/userRoute');

app.use('/api/users', userRoute);


module.exports = app;
