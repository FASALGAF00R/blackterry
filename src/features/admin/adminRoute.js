const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multerMiddleware');
const userManagementController = require('./userManagementController');
const categoryController = require('./categoryController');
const productController  = require('./productController');
const coupanController =require('../coupan/coupanController')
const OrderController=require('../admin/orderController')

router.get('/getusers', userManagementController.getAllUsers);
router.patch('/block/:userid',userManagementController.blockuser)
router.patch('/unblock/:userid',userManagementController.unblockuser)

router.post('/addcategory',categoryController.addCategory)
router.put('/editcategory/:id',categoryController.editCategory)
router.patch('/catblock/:catid',categoryController.blockcategory)
router.patch('/catunblock/:catid',categoryController.unblockcategory)


router.post('/addproduct',upload.array('images',5),productController.addProduct)
router.patch('/blockproduct/:id',productController.blockproduct)
router.patch('/unblockproduct/:id',productController.unblockproduct)


router.post('/addcoupan',coupanController.Addcoupan)
router.patch('/blockcoupan/:id',coupanController.blockcoupan)
router.patch('/unblockcoupan/:id',coupanController.unblockcoupan)

router.put('/editcoupan/:coupanid',coupanController.Editcoupan)
router.delete('/deletecoupan/:coupanid',coupanController.Deletecoupan)

router.get('/orders',OrderController.vieworders)
router.get('/getsingleorders/:orderid',OrderController.getSingleorder)
router.put('/updateorder',OrderController.Orderstatus)

module.exports = router;




