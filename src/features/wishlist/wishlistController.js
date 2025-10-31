const product = require('../products/productModel')
const user = require('../user/userModel');
const wishlist = require("../wishlist/wishlistModel");

exports.addwishlist = async (req, res) => {
    console.log("tth");
    try {
        const { userid, productid } = req.body;
        console.log(req.body, "//");
        const findproduct = await product.findById(productid)
        console.log(findproduct, "ooo");
        const finduser = await user.findById(userid)
        console.log(finduser, "dsjdjf");

        const newwishlist = new wishlistModel({
            userId: userid,
            productId: productid
        })
        await newwishlist.save()

        return res.status(200).json({ message: "product added to wishlist succesfully", product: findproduct })

    } catch (error) {
        console.log(error.message);

    }
}

exports.getawishlist = async (req, res) => {
    try {
        console.log("ethi");
        const userid = req.params.userid
        console.log(userid, "gdgdg");
        const getwishlistbyid = await wishlist.find({ userId: userid }).populate("productId")
        
        return res.status(200).json({
            message: "Wishlist fetched successfully",
            wishlist: getwishlistbyid
        });


    } catch (error) {
        console.log(error.message);

    }
}


exports.removefromwish=async(req,res)=>{
    try {  
        const {userId,productId}=req.body
        console.log(req.body);
        
     const findwish=await wishlist.findOne({userId:userId,productId:productId})
     if(!findwish){
         return res.status(404).json({message:"wishlist not found"})
        }
        await wishlist.findOneAndDelete({userId:userId,productId:productId})
     return res.status(200).json({ message: "Wishlist item deleted successfully" });
    } catch (error) {
        console.log(error.message);      
    }    
}