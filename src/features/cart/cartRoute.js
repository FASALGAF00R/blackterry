const express=require('express')
const router=express.Router()
const cartcontroller=require('../cart/cartController')


router.post('/addcart',cartcontroller.addtocart)

module.exports=router