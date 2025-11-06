const User = require('../user/userModel')
const cartModel = require('../cart/cartModel');
const coupan = require('../coupan/coupanModel')
const Checkout = require('../checkout/checkoutModel')
const address = require('../address/addressModel')
const crypto = require("crypto");
const razorpayInstance = require('../../../config/razorpayInstance')

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
    console.log(finusercart,"..............");
    
    if (!finusercart) {
      return res.status(404).json({ message: "No cart found for this user" });
    }

    const totalAmount = finusercart.cartTotal;

    // Create Razorpay order
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_rcptid_${userId}`,
    };

    const order = await razorpayInstance.orders.create(options);

    console.log(" Razorpay order created:", order);

console.log(finusercart.cartTotal,"finusercart.cartTotal");


    const checkout = new Checkout({
      userId,
      products: finusercart.products.map((item) => ({
        productId: item.productId,
        title: item.productId.title,
        quantity: item.quantity,
        price: item.productId.price,
        totalPrice: item.totalPrice,
      })),
      finalAmount: finusercart.cartTotal,
      razorpayOrderId: order.id,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      paymentMethod:"Razorpay"
    });


    await checkout.save();

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      razorpayOrderId: order.id,
      checkoutId: checkout._id,
    });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};





// exports.verifyRazorpayPayment = async (req, res) => {
//   try {
//     const {
//       userId,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     console.log(req.body, ".................................");


//     // Step 1: Verify payment signature
//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign.toString())
//       .digest("hex");

//     if (expectedSign !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     // Step 2: Fetch user cart and address
//     const finusercart = await cartModel.findOne({ userId }).populate("products.productId");
//     if (!finusercart) return res.status(404).json({ message: "Cart not found" });

//     const findAddress = await address.findOne({ userid: userId });
//     if (!findAddress) return res.status(404).json({ message: "Address not found" });

//     const products = finusercart.products.map((item) => ({
//       productId: item.productId._id,
//       quantity: item.quantity,
//       price: item.price,
//       totalPrice: item.totalPrice,
//     }));

//     const totalAmount = finusercart.cartTotal;

//     // Step 3: Save order in MongoDB
//     const newOrder = new Checkout({
//       userId,
//       products,
//       totalAmount,
//       finalAmount: totalAmount,
//       paymentMethod: "Razorpay",
//       paymentStatus: "Paid",
//       orderStatus: "Confirmed",
//       address: [findAddress],
//       createdAt: new Date(),
//     });

//     await newOrder.save();
//     // await cartModel.deleteOne({ userId });

//     console.log(" Order saved successfully:", newOrder);

//     res.status(200).json({
//       success: true,
//       message: "Payment verified and order placed successfully",
//       order: newOrder,
//     });

//   } catch (error) {
//     console.error("Error verifying Razorpay payment:", error);
//     res.status(500).json({ success: false, message: "Payment verification failed" });
//   }
// };




// exports.placeOrder = async (req, res) => {
//     try {

//         // userid,productdetails,address,paymentmethod
//         const { userId, paymentMethod, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

//         console.log(req.body, "oo");
//         const finusercart = await cartModel.findOne({ userId }).populate("products.productId");


//         if (!finusercart) {
//             return res.status(404).json({ message: "No cart found for this user" });
//         }

//         const findAddress = await address.findOne({ userid: userId })

//         console.log(findAddress,"..................");


//         const products = finusercart.products.map((item) => ({
//             productId: item.productId._id,
//             quantity: item.quantity,
//             price: item.price,
//             totalPrice: item.totalPrice,
//         }));


//         const totalAmount = finusercart.cartTotal;
//         // for cod


//       if (paymentMethod === "COD") {

//         const newOrder = new Checkout({
//             userId,
//             products,
//             totalAmount,
//             paymentMethod,
//             status: "Pending",
//             finalAmount: totalAmount,
//             createdAt: new Date(),
//             address: [findAddress]
//         });

//         await newOrder.save();

//         // await cartModel.deleteOne({ userId });

//         res.status(201).json({
//             message: "Order placed successfully",
//             order: newOrder,
//         });


//     }


//         // razorpayment starting


//         if (paymentMethod === "Razorpay" && !razorpay_payment_id) {
//             const options = {
//                 amount: totalAmount * 100,
//                 currency: "INR",
//                 receipt: `order_rcptid_${userId}`,
//             };


//             const order = await razorpayInstance.orders.create(options);
//             console.log(order,"order");

//             return res.status(200).json({
//                 success: true,
//                 message: "Razorpay order created successfully",
//                 razorpayOrderId: order.id,
//                 amount: order.amount,
//                 currency: order.currency,
//             });
//         }

//         // got the ids needed for payment

//         console.log(razorpay_payment_id, "razorpay_payment_id");
//         console.log(razorpay_order_id,"razorpay_order_id");
//         console.log(razorpay_signature,"razorpay_signature");

//         if (paymentMethod === "Razorpay" && razorpay_payment_id && razorpay_signature) {
//             const sign = razorpay_order_id + "|" + razorpay_payment_id;
//             const expectedSign = crypto
//                 .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//                 .update(sign.toString())
//                 .digest("hex");

//             if (expectedSign === razorpay_signature) {
//                 const newOrder = new Checkout({
//                     userId,
//                     products,
//                     totalAmount,
//                     finalAmount: totalAmount,
//                     paymentMethod: "Razorpay",
//                     paymentStatus: "Paid",
//                     orderStatus: "Confirmed",
//                     address: [findAddress],
//                 });

//                 await newOrder.save();

//                 console.log(newOrder,"neworder");

//                 // await cartModel.deleteOne({ userId });

//                 return res.status(200).json({
//                     success: true,
//                     message: "Payment verified and order placed successfully",
//                     order: newOrder,
//                 });
//             } else {
//                 return res.status(400).json({ success: false, message: "Invalid payment signature" });
//             }
//         }

//         return res.status(400).json({ message: "Invalid payment method or missing Razorpay details" });

//     } catch (error) {
//         console.log(error.message);

//     }
// }




exports.razorpayWebhook = async (req, res) => {
  try {

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    console.log(secret, "secret");

        const signature = req.headers["x-razorpay-signature"];

        if(signature){
          
              const shasum = crypto.createHmac("sha256", secret)
              .update(req.body).digest("hex")
        }



    if (shasum !== signature) {
        return res.status(400).json({ success: false, message: "Invalid signature" });
    }else{
        console.log("No signature provided — skipping verification for testing");  
    }

    // const event = req.body.event;

    // if (event === "payment.captured") {
    //   const payment = req.body.payload.payment.entity;
    //   console.log("Payment captured:", payment);

    //   const orderId = payment.order_id;
    //   const paymentId = payment.id;
    //   const amount = payment.amount / 100;


    const payload = JSON.parse(req.body.toString());
    const payment = payload.payload.payment.entity;


      await Checkout.findByIdAndUpdate(payment.notes.checkoutId, {
      paymentStatus: "Paid",
      razorpayPaymentId: payment.id,
      orderStatus: "Confirmed",
    });

        res.status(200).json({ success: true });

  } catch (error) {
    console.error(" Error in Razorpay webhook:", error.message);

  }
}


// skipped signature