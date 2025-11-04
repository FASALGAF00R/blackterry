const coupan=require('../coupan/coupanModel')
// coupan managed by admin

console.log(coupan,"coupannnnnnnnnnnn");


exports.Addcoupan=async(req,res)=>{
    console.log("enteredddddd");
    
    try {
        const{couponcode,couponamount,mincartamount,limit}=req.body
        console.log(req.body,"oo");
        const datetoday=new Date()
        const expiryDate = new Date();
           expiryDate.setDate(datetoday.getDate()+7) 
      console.log(expiryDate,"lll");
        const Newcoupan=new coupan({
            couponcode,
            couponamount,
            mincartamount,
            expiredate:expiryDate,
            limit

        })

      const coopan=  await Newcoupan.save()

      return res.status(200).json({message:"coupan added succesfully",coopan})

        
    } catch (error) {
        console.log(error.message);
        
    }
}



exports.Editcoupan=async(req,res)=>{
    try {
        const updateddata=req.body
        const {coupanid}=req.params
        console.log(coupanid,"coupanid");
         console.log(req.body,"jkjkjk");

         const updatedCoupon=await coupan.findByIdAndUpdate(coupanid,{$set:updateddata},{new:true})

         if(!updatedCoupon){
           return res.status(404).json({ message: "Coupon not found" });
         }

         res.status(200).json({message: "Coupon updated successfully", coupon: updatedCoupon,});
        
    } catch (error) {
        console.log(error.message);
    
    }
}


exports.Deletecoupan=async(req,res)=>{
    try {
        const {coupanid}=req.params
        console.log(coupanid,"coupanid");

        const Deletecooupan= await coupan.find
        
        
    } catch (error) {
        console.log(error.message);
        
    }
}
