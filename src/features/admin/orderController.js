const Checkout=require('../checkout/checkoutModel');

exports.vieworders=async(req,res)=>{
    try {
        const Allorders=await Checkout.find({})       
        return res.status(200).json({message:"sended all orders",Allorders})
    } catch (error) {
        console.log(error.message);
        
    }
}

exports.getsingleorders=async(req,res)=>{
    try {
        const orderid=req.params
        console.log(orderid);
        const findorder=await Checkout.findById({_id:orderid})

        if(!findorder){
            return res.status(404).json({ message: "Order not found" }); 
        }


        res.status(200).json({success:true,findorder})
        


    } catch (error) {
        console.log(error.message);
        
    }
}



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