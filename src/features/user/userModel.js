const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {  
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true,
    },
    Otp :{
        type: Number,   

    },
    phone :{
        type: Number,
        unique: true
    },
    isverified:{
        type: Boolean,
        default: false
    },
    isblock :{
        type:Boolean,
        default:true
    },
    is_delete :{
        type:Boolean,
        default:true
    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;