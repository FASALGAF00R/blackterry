const mongoose=require('mongoose')

const checkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },

     totalPrice: { type: Number },
    },
  ],

  totalAmount: {
    type: Number,
  },
  address:{
    type:Object,
    
  },

  discountAmount: {
    type: Number,
    default: 0,
  },

  finalAmount: {
    type: Number,
    required: true,
  },

  razorpayOrderId:{
    type :String
  },
 razorpayPaymentId: {
    type: String,
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Razorpay"],
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  orderStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentDate :{
    type:Date,
  }
});

module.exports = mongoose.model("Checkout", checkoutSchema);










