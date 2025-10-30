const user=require('../user/userModel');


const getAllUsers= async (req,res)=>{
    try {
        const users= await user.find({});   
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        
    }
}


const blockuser=async(req,res)=>{
    try {
        const {userid}=req.params;
        const userData= await user.findByIdAndUpdate(userid,{isblock:true},{new:true});
        res.status(200).json({message:"user blocked",userData});

    } catch (error) {
       console.log(error.message); 
    }
}


const unblockuser=async(req,res)=>{
    try {
        const {userid}=req.params;
        const userData= await user.findByIdAndUpdate(userid,{isblock:false},{new:true});
        res.status(200).json({message:"user unblocked",userData});

    } catch (error) {
       console.log(error.message); 
    }
}




module.exports={
 getAllUsers,
 blockuser,
 unblockuser
}