const User = require('../user/userModel')
const coupan = require('../coupan/coupanModel')
const Product = require("../products/productModel");
const categoryModel = require("../category/categoryModel");
const Checkout = require('../checkout/checkoutModel')


exports.getDashboardstats = async (req, res) => {
    try {
        const [users, categorys, products, coupans, orders,revenueData] = await Promise.all([
            User.countDocuments(),
            coupan.countDocuments({expiredate:{$gte:new Date()}}),
            Product.countDocuments(),   
            categoryModel.countDocuments(),
            Checkout.countDocuments(),
            Checkout.aggregate([{ $group: { _id: null, totalamount: { $sum: "$finalAmount" } } }])
        ])

        const totalRevenue = revenueData[0]?.totalamount || 0;    

        res.json({
            totalusers:users,
            totalcategories:categorys,
            totalproducts:products,
            totalbookings:orders,totalRevenue,
            activecoupans:coupans

        })
    } catch (error) {
        console.log(error.message);

    }
}

