const User = require('../user/userModel')
const cartModel = require('../cart/cartModel');
const coupan = require('../coupan/coupanModel')
const Checkout = require('../checkout/checkoutModel')
const address = require('../address/addressModel')
const crypto = require("crypto");
const razorpayInstance = require('../../../config/razorpayInstance')
const generateInvoice = require('../../../config/generateInvoice');


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

  } catch (error) {
    console.log(error.message);

  }
}


exports.Applycoupan = async (req, res) => {
  try {
    // discount needed to calculate
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


      res.status(200).json({ message: "coupan applied", finalamount, updatedcart: findcart, success: true })
    } else {
      return res.status(400).json({ message: "Minimum purchase amount required to use this coupon", success: false, });
    }


  }
  catch (error) {
    console.log(error.message);

  }
}



// userid,productdetails,razorpayordertracking save to chekout

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const finusercart = await cartModel.findOne({ userId }).populate("products.productId");
    if (!finusercart) {
      return res.status(404).json({ message: "No cart found for this user" });
    }

    const totalAmount = finusercart.cartTotal;

    let existingCheckout = await Checkout.findOne({
      userId,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    if (existingCheckout) {
      // Create a new Razorpay order for the same checkout
      const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `order_rcptid_${userId}`,
      };

      const order = await razorpayInstance.orders.create(options);

      existingCheckout.razorpayOrderId = order.id;
      existingCheckout.finalAmount = totalAmount;
      await existingCheckout.save();

      return res.status(200).json({
        success: true,
        message: "Reused existing checkout with new Razorpay order",
        razorpayOrderId: order.id,
        checkoutId: existingCheckout._id,
        finalAmount: totalAmount,
      });
    }

    //  Step 3: If not found, create a new checkout
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_rcptid_${userId}`,
    };

    const order = await razorpayInstance.orders.create(options);

    const newCheckout = new Checkout({
      userId,
      products: finusercart.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      finalAmount: totalAmount,
      razorpayOrderId: order.id,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      paymentMethod: "Razorpay",
    });

    await newCheckout.save();

    return res.status(200).json({
      success: true,
      message: "New Razorpay order created successfully",
      razorpayOrderId: order.id,
      checkoutId: newCheckout._id,
      finalAmount: totalAmount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};






exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    console.log(req.body, ".................................");


    // Verify payment signature
    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const findAddress = await address.findOne({ userid: userId });
    if (!findAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    const existingCheckout = await Checkout.findOne({ razorpayOrderId: razorpay_order_id });
    if (!existingCheckout) {
      return res.status(404).json({ success: false, message: "Checkout order not found" });
    }



    const updatedCheckout = await Checkout.findOneAndUpdate(
      { razorpayOrderId: razorpayOrderId },
      {
        $set: {
          razorpayPaymentId: razorpayPaymentId,
          paymentStatus: "Paid",
          orderStatus: "Confirmed",
          address: findAddress,
          paymentDate: new Date(),
        },
      },
      { new: true }
    ).populate("products.productId");


    await cartModel.deleteOne({ userId });

    console.log(" Order saved successfully:", updatedCheckout);

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: updatedCheckout,
    });

    const doc = generateInvoice(updatedCheckout);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${updatedCheckout._id}.pdf`
    );

    doc.pipe(res);





  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};


exports.createCODOrder = async (req, res) => {
  try {
    const { userId } = req.body;


    const finusercart = await cartModel.findOne({ userId }).populate("products.productId");
    
    if (!finusercart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const findAddress = await address.findOne({ userid: userId });
    if (!findAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    const products = finusercart.products.map((item) => ({
      productId: item.productId._id,
      title: item.productId.title,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.totalPrice,
    }));

    

    const checkout = new Checkout({
      userId,
      products,
      finalAmount: finusercart.cartTotal,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Confirmed",
      address: findAddress,
      orderDate: new Date(),
    });

    await checkout.save();

    await cartModel.deleteOne({ userId });

    res.status(200).json({
      success: true,
      message: "COD order placed successfully",
      order: checkout,
    });

  } catch (error) {
    console.error("Error creating COD order:", error);
    res.status(500).json({ success: false, message: "Failed to create COD order" });
  }
};


exports.downloadinvoice = async (req, res) => {
  try {
    const order = await Checkout.findById(req.params.orderId).populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.paymentStatus !== "Paid")
      return res.status(400).json({ message: "Payment not completed" });
    const user = await User.findById(order.userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const doc = generateInvoice(order, user);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id}.pdf`
    );
    doc.pipe(res);
    doc.end()
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating invoice" });
  }
};