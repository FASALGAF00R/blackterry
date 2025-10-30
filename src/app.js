const express = require('express');
const app = express();

// middlewares,apis,routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require('./features/user/userRoute');
const addressRoute = require('./features/address/addressRoute');
const profileRoute = require('./features/profile/profileRoute');
const adminRoute = require('./features/admin/adminRoute');

app.use('/api/users', userRoute);
app.use('/api/address',addressRoute)
app.use('/api/profile',profileRoute)

app.use('/api/admin',adminRoute)

module.exports = app;
