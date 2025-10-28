const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOTPEmail=require('../../../config/emailservice')

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        const existing = await User.findOne({email})
        if(existing){
            res.json({message: "User already exists"})
        }else{
            const User=await User.findOne({email})
             const otp=generateOTP();
             const hashedPassword = await bcrypt.hash(password, 10);
             const user = new User({name, email, password: hashedPassword,
             });
             await sendOTPEmail(email,otp);
            User.Otp=otp
            await user.save();
            res.status(201).json({message: "User registered successfully"})
        }
    }catch{
        console.log(console.error);
    }
}

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const finduser=await User.findOne({email})  
        const passwordcompare=await bcrypt.compare(password,finduser.password)
        if(!passwordcompare){
            return res.status(400).json({message:"Invalid password"})
        }

        if(finduser){
            const token=jwt.sign({id:finduser._id},process.env.JWT_SECRET,{expiresIn:'24h'});
            console.log(token,"token");
            
            return res.status(200).json({message:"user  logged in successfully",success:true,token})
        }else{
            return res.json({message:"no user found"})
        }
        
    } catch (error) {
        console.log(error);  
    }
}

const generateOTP = () => {
      const otp = Math.floor(100000 + Math.random() * 900000);
      return otp;
};


const otpverfiy =async(req,res)=>{
console.log("entered");

}

module.exports = { 
    registerUser,
    loginUser,
    otpverfiy
};