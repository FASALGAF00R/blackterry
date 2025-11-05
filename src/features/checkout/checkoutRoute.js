const express=require('express')
const router=express.Router()
const checkoutController=require('./checkoutController')


router.get('/loadcheckout',checkoutController.loadcheckout)
router.post('/applycoupan',checkoutController.Applycoupan)

router.post("/create-order", checkoutController.createRazorpayOrder);
router.post("/verify-payment", checkoutController.verifyRazorpayPayment);


module.exports=router