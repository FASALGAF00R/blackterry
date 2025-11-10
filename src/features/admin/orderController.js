const Checkout=require('../checkout/checkoutModel');

exports.vieworders=async(req,res)=>{
    try {
        const {orderStatus,limit,page}=req.query
        console.log(orderStatus,limit,page,"orderStatus");

        const filter=orderStatus ?  {orderStatus:orderStatus} : {}
        const findstatus=await Checkout.find(filter).sort({orderDate:-1}).skip(page).limit(parseInt(limit))
        console.log(findstatus,"klklk");
         res.status(200).json({message:"done",findstatus})
        const Allorders=await Checkout.find({})       
        return res.status(200).json({message:"sended all orders",Allorders})
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
        const {orderid,orderStatus}=req.body
        console.log(req.body,"iddddddddddd");

        const Updatingorders=await Checkout.updateOne({_id:orderid},{$set:{orderStatus:orderStatus}})
        console.log(Updatingorders,"updatingorderstatus");
        

         res.status(200).json({message:"order status updated"})

        if(Updatingorders.matchedCount ===0){
            return res.status(404).json({message:"order not found not updated"})
        }

        
    } catch (error) {
        console.log(error.message);
        
    }
}