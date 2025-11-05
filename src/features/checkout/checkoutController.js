const User = require('../user/userModel')
const cartModel = require('../cart/cartModel');
const coupan = require('../coupan/coupanModel')
const Checkout = require('../checkout/checkoutModel')
const address = require('../address/addressModel')


exports.loadcheckout = async (req, res) => {
    try {
        const userId = req.body
        console.log(userId, "userid");

        const finduser = await cartModel.findOne(userId).populate("products.productId");
        if (!finduser) {
            return res.status(404).json({ message: "no user found" })
        } else {
            res.json({ message: "cart items", cartitems: finduser })
        }
        console.log(finduser, 'jjjjjjjjjjjjj');

    } catch (error) {
        console.log(error.message);

    }
}


exports.Applycoupan = async (req, res) => {
    try {
        // discount needed to calculate
        console.log("apply coupan");
        const { userId, couponcode, Cartamount } = req.body
        console.log(userId, "userid");
        console.log(couponcode, "coupancode");
        console.log(Cartamount, "cartamount");

        const findcart = await cartModel.findOne({ userId: userId })
        console.log(findcart, "findcartttttttttt");

        if (!findcart) {
            return res.status(404).json({ message: "no product found on cart" })
        }

        const findcoupan = await coupan.findOne({ couponcode: couponcode })

        if (!findcoupan) {
            return res.status(404).json({ message: "no coupan found" })
        }

        if (findcoupan.expiredate < new Date()) {
            return res.status(404).json({ message: "coupan expired" })

        }

        if (findcoupan.limit <= 0) {
            return res.status(400).json({ message: "Coupon usage limit reached" });
        }

        if (Cartamount >= findcoupan.mincartamount) {
            const finalamount = Cartamount - findcoupan.couponamount
            findcoupan.limit -= 1

            await findcoupan.save()

            if (findcart) {
                findcart.cartTotal = finalamount
                await findcart.save()         
             }


            res.status(200).json({ message: "coupan applied", finalamount,updatedcart:findcart, success: true })
        }else{
             return res.status(400).json({ message: "Minimum purchase amount required to use this coupon",success: false,});
        }


}
    catch (error) {
        console.log(error.message);

    }
}


exports.placeOrder = async (req, res) => {
    try {

        // userid,productdetails,address,paymentmethod
        const { userId, paymentMethod } = req.body

        console.log(req.body, "oo");
        const finusercart = await cartModel.findOne({ userId }).populate("products.productId");

        if (!finusercart) {
            return res.status(404).json({ message: "No cart found for this user" });
        }



        const findAddress = await address.findOne({userid:userId})
        console.log(findAddress, "tttttttttt");


        const products = finusercart.products.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
        }));


        const totalAmount = finusercart.cartTotal;

        const newOrder = new Checkout({
            userId,
            products,
            totalAmount,
            paymentMethod,
            status: "Pending",
            finalAmount: totalAmount,
            createdAt: new Date(),
            address:[findAddress]
        });

        await newOrder.save();

        // await cartModel.deleteOne({ userId });

        res.status(201).json({
            message: "Order placed successfully",
            order: newOrder,
        });
    } catch (error) {
        console.log(error.message);

    }
}