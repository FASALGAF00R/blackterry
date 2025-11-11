const mongoose = require("mongoose");
const couponSchema = mongoose.Schema({
    couponcode: {
        type: String,
        required: true,
         unique: true

    },      
    couponamount: {
        type: Number,
        required: true
    },
    mincartamount: {
        type: Number,
        default: 2000
    },
    expiredate: {
        type: Date,
        required: true
    },
    limit :{
        type: Number,

    },
    is_block: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('coupon', couponSchema)








