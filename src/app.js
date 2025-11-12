const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet=require('helmet')


// middlewares,apis,routes
app.use(helmet())
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
const dashboardRoute=require('./features/Dashboard/dashboardRoute')

app.use('/api/users', userRoute);
app.use('/api/address',addressRoute)
app.use('/api/profile',profileRoute)
app.use('/api/wishlist',wishlistRoute)
app.use('/api/cart',cartRoute)
app.use('/api/checkout',checkoutRoute)
app.use('/api/admin',adminRoute)
app.use('/api/dashboard',dashboardRoute)

module.exports = app;
