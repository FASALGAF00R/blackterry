const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categoryid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },
     categoryName: {
    type: String,
  },
    title :{
        type: String,
        required: true
    },
    description :{
        type: String,
        required: true
    },
    actualPrice :{
        type: Number,
        required: true
    },  
    images:[{
        type: String,
        required: true
    }],
    product_Code :{
        type: String,
        unique: true,
    },
      discount: { 
        type: Number,
         default: 0 
        },
        offerPrice: { 
            type: Number,
            required:true
         },
         manufacture_name :{
            type: String,
         },
         manufacturerBrand :{
            type: String,
         },
         manufacturerAddress :{
            type: String,
         },
           totalStock: { 
            type: Number,
             default: 0 
            },
})
const Product = mongoose.model('Product', productSchema);

module.exports = Product;