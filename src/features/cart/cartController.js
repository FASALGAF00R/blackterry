const User = require('../user/userModel')
const product = require('../products/productModel')
const cartModel = require('../cart/cartModel');

exports.addtocart = async (req, res) => {
    console.log("entered");

    try {
        const { userId, productId, quantity } = req.body
        console.log(userId, "u");
        console.log(productId, "p");
        console.log(quantity, "q");


        const findproduct = await product.findById({ _id: productId })
        console.log(findproduct.actualPrice, "findproduct");

        if (!findproduct) {
            return res.status(404).json({ message: 'product not found' })
        } else {
            const checkcart = await cartModel.findOne({ userId, productId })
            console.log(checkcart, "checkcart");
            if (checkcart) {
                checkcart.quantity = checkcart.quantity + 1
                checkcart.totalPrice = checkcart.quantity * checkcart.price
                await checkcart.save()
                res.json({ message: "quantity updated", checkcart })
            } else {
                const price = findproduct.actualPrice;
                console.log(price, "price");

                const newproduct = new cartModel({
                    userId,
                    productId,
                    price,
                    quantity: 1,
                    totalPrice: 1 * price
                })
                console.log(newproduct, 'newproduct');

                await newproduct.save()
                return res.status(200).json({ message: "product added succefully" })
            }


        }
     } catch (error) {
        console.log(error.message);
    }
}

        

exports.updatecart = async (req, res) => {
    try {
          const { userId, productId, quantity } = req.body

          const findcardproduct =await cartModel.findOne({userId,productId})
          console.log(findcardproduct,"finddd");

          findcardproduct.quantity=quantity
          findcardproduct.totalPrice=quantity * findcardproduct.price

          await findcardproduct.save()
     res.status(200).json({ message: "Quantity updated", findcardproduct });

    } catch (error) {
        console.log(error.message);
        
    }  
}



exports.deleteproduct=async(req,res)=>{
    try {
        const cartid=req.params.cartid
        console.log(cartid,"gg");

        const findcart=await cartModel.findOneAndDelete(cartid)
        if(!findcart){
            return res.status(404).json({message:"item not found"})
        }
        console.log(findcart,"ddddd");

        res.status(200).json({message:"Deleted product"})
    } catch (error) {
        console.log(error.message);
    }
}

exports.getusercart=async(req,res)=>{
    try {
        const id =req.params.id
        console.log(id,"id");
        const finduser=await cartModel.find({userId:id}).populate("productId")
        console.log(finduser);
        res.status(200).json(finduser)
    } catch (error) {
        console.log(error.message);
    }
}




