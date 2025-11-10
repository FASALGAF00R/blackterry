const express=require('express')
const router=express.Router()
const checkoutController=require('./checkoutController')

router.get('/loadcheckout',checkoutController.loadcheckout)
router.post('/applycoupan',checkoutController.Applycoupan)

router.post("/createorder", checkoutController.createRazorpayOrder);
router.post("/verifypayment", checkoutController.verifyRazorpayPayment);
router.post('/codpayment',checkoutController.createCODOrder)

// router.post('/webhook',express.raw({ type: "application/json" }),checkoutController.razorpayWebhook)


module.exports=router