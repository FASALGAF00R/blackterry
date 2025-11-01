const User=require('../user/userModel')
const product=require('../products/productModel')
const Cart=require('../cart/cartModel')

exports.addtocart=async (req,res)=>{
    console.log("entered");
    
    try {
        const {userid,productid,quantity}=req.body
        console.log(req.body,"m");
        

        
        
    } catch (error) {
        console.log(error.message);
        
    }

}