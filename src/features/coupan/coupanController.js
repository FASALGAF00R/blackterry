const coupan=require('./coupanModel')

// coupan managed by admin

exports.Addcoupan=async(req,res)=>{
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

