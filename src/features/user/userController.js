const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../../../config/emailservice')
const axios = require('axios');
const NodeCache = require("node-cache");
// use to store OTP sessions temporarily
const otpCache = new NodeCache({ stdTTL: 300 });

require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const mobapikey = process.env.MOBILE_API_KEY;
        const existing = await User.findOne({ email })

        if (existing) {
            res.json({ message: "User already exists" })
            // } else {
            //     const otp = generateOTP();
            //     const hashedPassword = await bcrypt.hash(password, 10);
            //     const user = new User({
            //         name, email, password: hashedPassword,
            //     });

            //     await sendOTPEmail(email, otp);
            //     user.Otp = otp
            //      user.isverified=true

            //     await user.save();
            //     res.status(201).json({ message: "User registered successfully" })
            // }
    
         } else {
            const response = await axios.get(`https://2factor.in/API/V1/${mobapikey}/SMS/${phone}/AUTOGEN/OTP1`)
            console.log(response, "response");
            if (response.data.Status === "Success") {
                const sessionId = response.data.Details;
                // saving values to cache with phone as key
                otpCache.set(phone, 
                    {
                    sessionId,
                    name,
                    email,
                    phone,
                    password,
                });
              return  res.status(200).json({ message: 'OTP sent successfully' });
            } else {
                return res.status(500).json({ message: 'Failed to send OTP. Try again later.' })
            }
         }
    } catch (error) {
        console.log(error.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;        
        const finduser = await User.findOne({ email })
        const passwordcompare = await bcrypt.compare(password, finduser.password)
        if (!passwordcompare) {
            return res.status(400).json({ message: "Invalid password" })
        }

        if (finduser.isverified === true) {
            const token = jwt.sign({ id: finduser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            console.log(token, "token");

            return res.status(200).json({ message: "user  logged in successfully", success: true, token })
        } else {
            return res.json({ message: "Please verify your email to login" })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
};


const otpverfiy = async (req, res) => {
    try {
        const { otp, phone } = req.body;
        console.log(otp, phone, ".......");
        const mobapikey = process.env.MOBILE_API_KEY;
        const sessionData = otpCache.get(phone);
        console.log(sessionData,"sessionnn");
        
        if (!sessionData) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }
        const response = await axios.get(`https://2factor.in/API/V1/${mobapikey}/SMS/VERIFY/${sessionData.sessionId}/${otp}`);
        console.log(response.data, "otpresponse");
        if (response.data.Status !== "Success") {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const hashedPassword=await  bcrypt.hash (sessionData.password,10)
        console.log(hashedPassword,"hashedPassword");
        const newUser = new User({
            name: sessionData.name,
            email: sessionData.email,
            phone: sessionData.phone,
            password: hashedPassword,
            isverified: true
        });
        await newUser.save();
        otpCache.del(phone);

        return res.status(200).json({ message: "OTP verified successfully, user registered!" });

    } catch (error) {
        console.log(error.message);
    }

}



module.exports = {
    registerUser,
    loginUser,
    otpverfiy
};