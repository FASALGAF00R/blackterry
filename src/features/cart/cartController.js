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

        const qty = quantity || 1;

        const findProduct = await product.findById(productId);
        if (!findProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const price = findProduct.offerPrice && findProduct.offerPrice < findProduct.actualPrice
            ? findProduct.offerPrice
            : findProduct.actualPrice;


        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            const newCart = new cartModel({
                userId,
                products: [
                    {
                        productId,
                        quantity: qty,
                        price,
                        totalPrice: qty * price,
                    },
                ],
                cartTotal: qty * price, 
            });

            await newCart.save();
            return res
                .status(201)
                .json({ message: "Cart created and product added", cart: newCart });
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        );


        if (productIndex !== -1) {
            cart.products[productIndex].quantity += qty;
            cart.products[productIndex].totalPrice =
                cart.products[productIndex].quantity *
                cart.products[productIndex].price;
        } else {
            cart.products.push({
                productId,
                quantity: qty,
                price,
                totalPrice: qty * price,
            });
        }

        cart.cartTotal = cart.products.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        await cart.save();

        res.status(200).json({
            message: "Product added/updated in cart successfully",
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

    // ✅ Add quantity instead of replacing
    cart.products[productIndex].quantity += quantity;

    // Update price and total
    cart.products[productIndex].price = price;
    cart.products[productIndex].totalPrice =
      cart.products[productIndex].quantity * price;

    // ✅ Recalculate cart total
    cart.cartTotal = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully (quantity increased)",
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
        console.log(cartid, "gg");

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
        console.log(id, "id");
        const finduser = await cartModel.find({ userId: id }).populate("products.productId");

        console.log(finduser);
        res.status(200).json(finduser)
    } catch (error) {
        console.log(error.message);
    }
}




