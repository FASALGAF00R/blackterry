const mongoose=require('mongoose')


const addressSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    firstname: {
        type: String,
        required: [true,"firstname is required"],
    },
    lastname: {
        type: String,
        required: [true, "lasname is required"],
    },
    number: {
        type: String,
        required: [true, "phone is required"],
    },
    address: {
        type: String,
        required: [true, "address is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },

});





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
      price: {
        type: Number,
      },
    },
  ],

  totalAmount: {
    type: Number,
  },

  discountAmount: {
    type: Number,
    default: 0,
  },

  finalAmount: {
    type: Number,
    required: true,
  },

  address :[addressSchema],

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
});

module.exports = mongoose.model("Checkout", checkoutSchema);










