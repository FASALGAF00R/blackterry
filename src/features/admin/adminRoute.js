const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multerMiddleware');
const userManagementController = require('./userManagementController');
const categoryController = require('./categoryController');
const productController  = require('./productController');


router.get('/getusers', userManagementController.getAllUsers);
router.patch('/block/:userid',userManagementController.blockuser)
router.patch('/unblock/:userid',userManagementController.unblockuser)

router.post('/addcategory',categoryController.addCategory)
router.put('/editcategory/:id',categoryController.editCategory)

router.post('/addproduct',upload.array('images',5),productController.addProduct)



module.exports = router;




