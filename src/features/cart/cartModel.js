const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
 
      quantity: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      default: 0
    }
  }],
     coupan: {
      coupancode:{type:String},
      discount:{type:Number}
    },
  cartTotal: {
    type: Number,
    default: 0
  },
});



module.exports = mongoose.model('Cart', cartSchema);

