const User=require('../user/userModel')
const cartModel = require('../cart/cartModel');

exports.loadcheckout=async(req,res)=>{
    try {
        const {id}=req.body
        console.log(id,"userid");
        const finduser=await cartModel.findOne({id}).populate('productId')
        if(!finduser){
            return res.status(404).json({message:"no user found"})
        }else{
            res.json({message:"cart items",cartitems:finduser})
        }
        console.log(finduser,'jjjjjjjjjjjjj');
        
    } catch (error) {
        console.log(error.message);
        
    }
}
