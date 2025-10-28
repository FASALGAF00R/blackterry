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
    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;