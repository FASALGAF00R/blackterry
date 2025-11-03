const express=require('express')
const router=express.Router()
const checkoutController=require('./checkoutController')


router.get('/loadcheckout',checkoutController.loadcheckout)




module.exports=router