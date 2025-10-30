const express = require('express');
const router = express.Router();

const userManagementController = require('./userManagementController');
const categoryController = require('./categoryController');


router.get('/getusers', userManagementController.getAllUsers);
router.patch('/block/:userid',userManagementController.blockuser)
router.patch('/unblock/:userid',userManagementController.unblockuser)

router.post('/addcategory',categoryController.addCategory)
module.exports = router;




