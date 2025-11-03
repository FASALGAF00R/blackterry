const User=require('../user/userModel')
const cartModel = require('../cart/cartModel');
const coupan =require('../coupan/coupanModel')

exports.loadcheckout=async(req,res)=>{
    try {
        const userId=req.body
        console.log(userId,"userid");
        
        const finduser=await cartModel.findOne(userId).populate('productId')
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


exports.Applycoupan=async (req,res)=>{
    try {
        // discount needed to calculate
        console.log("apply coupan");
        const{userId,couponcode,Cartamount}=req.body
        console.log(userId,"userid");
        console.log(couponcode,"coupancode");
        console.log(Cartamount,"cartamount");
        
        
        

        const findcart=await cartModel.findOne({userId:userId})
        console.log(findcart,"findcartttttttttt");
        
        
        if(!findcart){
            return res.status(404).json({message:"no product found on cart"})
        }
        
        const findcoupan=await coupan.findOne({couponcode:couponcode})

        if(!findcoupan){
            return res.status(404).json({message:"no coupan found"})
        }

        if(findcoupan.expiredate < new Date()){
            return res.status(404).json({message:"coupan expired"})

        }

        if(findcoupan.limit <=0){
        return res.status(400).json({ message: "Coupon usage limit reached" });
        }

        if(Cartamount>findcoupan.couponamount){ 
            const finalamount=Cartamount-findcoupan.couponamount
            findcoupan.limit-=1

            await findcoupan.save()
            res.status(200).json({message:"coupan applied",finalamount,success:true})
        }else{
        return res.status(400).json({message:"Minimum purchase amount needed" })}
       }
      catch (error) {
        console.log(error.message);
        
    }
}
