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

// /api/products?categoryName=men&title=shirt&minprice=500&maxprice=2000&sortby=actualPrice&order=asc
// sortby=actualPrice&order=desc
const listproducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortby = "title",
      order = "asc",
      title,
      categoryName,
      minprice,
      maxprice,
    } = req.query;

    const matchstage = {};

    if (categoryName) {
      matchstage.categoryName = { $regex: `^${categoryName}$`, $options: "i" };
    }

    if (title) {
      matchstage.title = { $regex: title, $options: "i" };
    }

    if (minprice && maxprice) {
      matchstage.actualPrice = {
        $gte: Number(minprice),
        $lte: Number(maxprice),
      };
    } else if (minprice) {
      matchstage.actualPrice = { $gte: Number(minprice) };
    } else if (maxprice) {
      matchstage.actualPrice = { $lte: Number(maxprice) };
    }

    const isFilterEmpty = Object.keys(matchstage).length === 0;

    const sortOrder = order === "desc" ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const pipeline = [
      ...(isFilterEmpty ? [] : [{ $match: matchstage }]),
      {
        $project: {
          title: 1,
          categoryName: 1,
          description: 1,
          actualPrice: 1,
          discount: 1,
          offerPrice: {
            $subtract: [
              "$actualPrice",
              {
                $multiply: ["$actualPrice", { $divide: ["$discount", 100] }],
              },
            ],
          },
          images: 1,
          product_Code: 1,
          manufacture_name: 1,
          manufacturerBrand: 1,
          manufacturerAddress: 1,
          totalStock: 1,
        },
      },
      { $sort: { [sortby]: sortOrder } },
      { $skip: skip },
      { $limit: Number(limit) },
    ];

    const [productsList, totalProducts] = await Promise.all([
      products.aggregate(pipeline),
      isFilterEmpty ? products.countDocuments() : products.countDocuments(matchstage),
    ]);

    return res.status(200).json({
      success: true,
      totalProducts,
      totalPages: Math.ceil(totalProducts / Number(limit)),
      currentPage: Number(page),
      products: productsList,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
        registerUser,
        loginUser,
        otpverfiy,
        listproducts

    };