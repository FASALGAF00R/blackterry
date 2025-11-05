const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
        type: Number,
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

const address= mongoose.model('address',addressSchema)
module.exports=address;