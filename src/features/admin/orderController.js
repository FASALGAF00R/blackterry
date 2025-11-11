const Checkout=require('../checkout/checkoutModel');
const Product = require("../products/productModel");


exports.vieworders=async(req,res)=>{
    try {
        const {orderStatus,limit,page}=req.query
        const filter=orderStatus ?  {orderStatus:orderStatus} : {}

        const pagenumber=parseInt(page) || 1
        const limitnumber=parseInt(limit) || 1
        
        const filteredproducts=await Checkout.find(filter).sort({orderDate:-1}).skip(pagenumber-1*(limitnumber)).limit(limitnumber)
        
        const totalOrders = await Checkout.countDocuments(filter);
        return res.status(200).json({message:"sended all orders",orders:filteredproducts,totalOrders})
    } catch (error) {
        console.log(error.message);
        
    }
}

// exports.getsingleorders=async(req,res)=>{
//     try {
//         const orderid=req.params
//         console.log(orderid);
//         const findorder=await Checkout.findById({_id:orderid})

//         if(!findorder){
//             return res.status(404).json({ message: "Order not found" }); 
//         }
//         res.status(200).json({success:true,findorder})
//     } catch (error) {
//         console.log(error.message);
        
//     }
// }



exports.getSingleorder=async(req,res)=>{
    try {
        const orderid=req.params.orderid
        console.log(orderid,"orderid");
        const singleorder=await Checkout.findById(orderid)

        if(!singleorder){
            return res.status(404).json({ message: "Order not found" });
        }
          res.status(200).json({ success: true, singleorder });
        
    } catch (error) {
        console.log(error.message);
        
    }
}



exports.Orderstatus=async(req,res)=>{
    try {
        const {orderid,orderStatus,paymentStatus}=req.body
        console.log(req.body,"iddddddddddd");

        const Updatingorders=await Checkout.updateOne({_id:orderid},{$set:{orderStatus:orderStatus,paymentStatus: paymentStatus}})
        console.log(Updatingorders,"updatingorderstatus");

        const Findproduct=await Checkout.findById({_id:orderid}).populate("products.productId")
        console.log(Findproduct,"llll");
        
        if(orderStatus==="Delivered" && paymentStatus==="Paid"){
            for(const item of Findproduct.products){
                const productid=item.productId
                const qty=item.quantity

                await Product.updateOne({_id:productid},{$inc:{totalStock:-qty}})
            } 
        }
         res.status(200).json({message:"order status updated"})

        if(Updatingorders.matchedCount ===0){
            return res.status(404).json({message:"order not found not updated"})
        }

        
    } catch (error) {
        console.log(error.message);
        
    }
}