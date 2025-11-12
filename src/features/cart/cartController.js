const User = require('../user/userModel')
const product = require('../products/productModel')
const cartModel = require('../cart/cartModel');

exports.addtocart = async (req, res) => {
    try {
        const { userId, productId } = req.body
        console.log(userId, "u");
        console.log(productId, "p");

        const qty = 1;
        const findProduct = await product.findById(productId);
        if (!findProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        // taking product price accordingly

        const price = findProduct.offerPrice && findProduct.offerPrice < findProduct.actualPrice
            ? findProduct.offerPrice
            : findProduct.actualPrice;


        let cart = await cartModel.findOne({ userId });
        const totalPrice = qty * price

        if (!cart) {
            const newCart = new cartModel({
                userId,
                products: [
                    {
                        productId,
                        quantity: qty,
                        price,
                        totalPrice,
                    },
                ],
                cartTotal: totalPrice,
            });

            await newCart.save();

            return res.status(201).json({ message: "Cart created and product added", cart: newCart });
        }

        // checking single product  exsits in cart product

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        );


        if (productIndex !== -1) {
            cart.products[productIndex].quantity += qty;
            cart.products[productIndex].totalPrice = cart.products[productIndex].quantity * cart.products[productIndex].price;
        } else {
            cart.products.push({
                productId,
                quantity: qty,
                price,
                totalPrice,
            });
        }

        cart.cartTotal = cart.products.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        await cart.save();

        res.status(200).json({
            message: "Product added,updated in cart successfully",
            cart,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};




exports.updatecart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;


        if(typeof quantity=== "number"){
            return res.status(400).json({message:"invalid quantity"})

        }

        const cart = await cartModel.findOne({ userId }).populate("products.productId");
        if (!cart) {
            return res.status(400).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId._id.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const productData = cart.products[productIndex].productId;

        const price =
            productData.offerPrice && productData.offerPrice < productData.actualPrice
                ? productData.offerPrice
                : productData.actualPrice;

        cart.products[productIndex].quantity += quantity;


        if (cart.products[productIndex].quantity < 1) {
            cart.products.splice(productIndex, 1)
        }else{
            cart.products[productIndex].price = price;
            cart.products[productIndex].totalPrice =
                cart.products[productIndex].quantity * price;
        }


        cart.cartTotal = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

        await cart.save();

        const message=quantity > 0 ? "cart updated successfully quantity increased":"Cart updated successfully (quantity decreased or item removed)"

        res.status(200).json({
            message,
            cart,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};




exports.deleteproduct = async (req, res) => {
    try {
        const cartid = req.params.cartid

        const findcart = await cartModel.findOneAndDelete(cartid)
        if (!findcart) {
            return res.status(404).json({ message: "item not found" })
        }
        console.log(findcart, "ddddd");

        res.status(200).json({ message: "Deleted product" })
    } catch (error) {
        console.log(error.message);
    }
}

exports.getusercart = async (req, res) => {
    try {
        const id = req.params.id
        const finduser = await cartModel.find({ userId: id }).populate("products.productId");

        console.log(finduser);
        res.status(200).json(finduser)
    } catch (error) {
        console.log(error.message);
    }
}




