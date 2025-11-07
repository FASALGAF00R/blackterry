const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const cors = require("cors");


// middlewares,apis,routes
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoute = require('./features/user/userRoute');
const addressRoute = require('./features/address/addressRoute');
const profileRoute = require('./features/profile/profileRoute');
const adminRoute = require('./features/admin/adminRoute');
const wishlistRoute=require('./features/wishlist/wishlistRoute')
const cartRoute=require('./features/cart/cartRoute')
const checkoutRoute=require('./features/checkout/checkoutRoute')

app.use('/api/users', userRoute);
app.use('/api/address',addressRoute)
app.use('/api/profile',profileRoute)
app.use('/api/wishlist',wishlistRoute)
app.use('/api/cart',cartRoute)
app.use('/api/checkout',checkoutRoute)
app.use('/api/admin',adminRoute)

module.exports = app;
