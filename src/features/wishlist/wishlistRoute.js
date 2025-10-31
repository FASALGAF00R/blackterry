const express = require('express');
const router = express.Router();

const wishlistController=require('./wishlistController')

router.post('/addwish',wishlistController.addwishlist)
router.get('/:userid',wishlistController.getawishlist)

router.delete('/deletewish',wishlistController.removefromwish)

module.exports=router