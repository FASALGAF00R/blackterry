const express=require('express')
const router=express.Router()
const cartcontroller=require('../cart/cartController')


router.post('/addcart',cartcontroller.addtocart)
router.put('/updatecart',cartcontroller.updatecart)
router.delete('/:cartid',cartcontroller.deleteproduct)
router.get('/viewcart/:id',cartcontroller.getusercart)


module.exports=router