const express = require('express');
const app = express();
const path = require('path');


// middlewares,apis,routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoute = require('./features/user/userRoute');
const addressRoute = require('./features/address/addressRoute');
const profileRoute = require('./features/profile/profileRoute');
const adminRoute = require('./features/admin/adminRoute');
const wishlistRoute=require('./features/wishlist/wishlistRoute')


app.use('/api/users', userRoute);
app.use('/api/address',addressRoute)
app.use('/api/profile',profileRoute)
app.use('/api/wishlist',wishlistRoute)
app.use('/api/admin',adminRoute)

module.exports = app;
