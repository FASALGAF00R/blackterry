const User=require('../user/userModel')
const product=require('../products/productModel')
const cartModel = require('../cart/cartModel');

exports.addtocart=async (req,res)=>{
    console.log("entered");
    
    try {
        const {userId,productId,quantity}=req.body
        console.log(userId,"u");
        console.log(productId,"p");
        console.log(quantity,"q");
        
        
        const findproduct=await product.findById({_id:productId})
        console.log(findproduct.actualPrice,"findproduct");
        
        if(!findproduct){
            return res.status(404).json({message:'product not found'})
        }else{
            const checkcart =await cartModel.findOne({userId,productId})
            console.log(checkcart,"checkcart");
            if(checkcart){
                checkcart.quantity =checkcart.quantity + 1
                checkcart.totalPrice=checkcart.quantity * checkcart.price
                await checkcart.save()
                res.json({message:"quantity updated",checkcart})               
            }else{
                const price = findproduct.actualPrice;
                console.log(price,"price");
                
                const newproduct=new cartModel({
                    userId,
                    productId,
                    price,
                    quantity:1,
                    totalPrice:1*price
                })
                console.log(newproduct,'newproduct');
                
                await newproduct.save()
                return res.status(200).json({message:"product added succefully"})
            }
            

        }

        


        
        
    } catch (error) {
        console.log(error.message);
        
    }

}