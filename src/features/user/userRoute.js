const express = require('express');
const router = express.Router();
const jwttokenverify =require('../../middleware/jwtMiddleware');

const userController = require('./userController');

router.post('/register', userController.registerUser);
router.post('/login',userController.loginUser);
router.post('/otpverify',userController.otpverfiy)

router.get('/products',userController.listproducts)

module.exports = router;