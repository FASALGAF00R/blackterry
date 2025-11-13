const User = require('./userModel');
const products = require('../products/productModel');
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
                return res.status(200).json({ message: 'OTP sent successfully' });
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

        if (finduser.isblock === true) {
            return res.status(403).json({ message: "Your account has been blocked" });
        }

        if (finduser.isverified === true) {
            const token = jwt.sign({ id: finduser._id }, process.env.JWT_SECRET);
            console.log(token, "token");

            return res.status(200).json({ message: "user  logged in successfully", success: true, token })
        } else {
            return res.json({ message: "Please verify your email to login " })
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
        console.log(sessionData, "sessionnn");

        if (!sessionData) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }
        const response = await axios.get(`https://2factor.in/API/V1/${mobapikey}/SMS/VERIFY/${sessionData.sessionId}/${otp}`);
        console.log(response.data, "otpresponse");
        if (response.data.Status !== "Success") {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const hashedPassword = await bcrypt.hash(sessionData.password, 10)
        console.log(hashedPassword, "hashedPassword");
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


const listproducts = async (req, res) => {
    try {
        const { page = 1, limit = 1, sortby = 'title', order = 'asc', title, categoryName, minprice, maxprice } = req.query
        console.log(req.query, 'queryyy');

        console.log(title, "search");
        console.log(categoryName, "category");

        const matchstage = {}
        console.log(matchstage, 'matchstage');

        if (categoryName) {
            matchstage.categoryName = categoryName;
        }

        if (minprice && maxprice) {
            matchstage.actualPrice = { $gte: Number(minprice), $lte: Number(maxprice) };
        } else if (minprice) {
            matchstage.actualPrice = { $gte: Number(minprice) };
        } else if (maxprice) {
            matchstage.actualPrice = { $lte: Number(maxprice) };
        }

        // search by title or category

        if (title) {
            matchstage.$or = [{ title: { $regex: title, $options: 'i' } },
            { categoryName: { $regex: categoryName, $options: 'i' } }
            ]
        }

        const pipeline = [
            { $match: matchstage },
            {
                $project
                    : {
                    categoryName: 1, title: 1, description: 1,
                    actualPrice: 1, images: 1,
                    product_Code: 1, discount: 1,
                    offerPrice: { $subtract: ["$actualPrice", { $multiply: ["$actualPrice", { $divide: ["$discount", 100] }] }] },
                    manufacture_name: 1, manufacturerBrand: 1, manufacturerAddress: 1, totalStock: 1
                }
            },
        ]

        const sortOrder = order === 'desc' ? -1 : 1;
        pipeline.push({ $sort: { [sortby]: sortOrder } });

        const skip = (Number(page) - 1) * Number(limit);
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: Number(limit) });


        const totalProducts = await products.countDocuments(matchstage);

        const Allproducts = await products.aggregate(pipeline);

        return res.status(200).json({
            totalProducts,
            totalPages: Math.ceil(totalProducts / Number(limit)),
            currentPage: Number(page),
            products: Allproducts
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    registerUser,
    loginUser,
    otpverfiy,
    listproducts

};