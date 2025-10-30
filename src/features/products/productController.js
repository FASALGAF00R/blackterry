const product=require('../products/productModel')


const listproducts=async(req,res)=>{
    try {
        console.log("h");
        const products=await product.find({});  
       return res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    listproducts
};