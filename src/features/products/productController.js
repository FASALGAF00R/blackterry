const product=require('../products/productModel')


const productsuser=async(req,res)=>{
    console.log("okokkoko");
    
    try {
        console.log("h");
        const products= await product.find({});
    
        console.log(products,"kkkkk");
        
       return res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
    }
}







module.exports = {
    productsuser
};