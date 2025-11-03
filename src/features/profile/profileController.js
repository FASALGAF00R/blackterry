
const User = require('../user/userModel');

const getuserprofile=async(req,res)=>{
try {
    const userid=req.params.id;
    const userprofile=await User.findById(userid)
    if(!userprofile){
        return res.status(404).json({message:"user not found"});
    }
   return res.status(200).json({userprofile});
    
} catch (error) {
    console.log(error.message);
}
}

const updateuserprofile=async(req,res)=>{
    try {
        const userid=req.params.id
        const {name,phone}=req.body
        const finduser =await User.findById({_id:userid})
        if(!finduser){
            return res.status(404).json({message:"user not found"})
        }else{
            finduser.name=name
            finduser.phone=phone
           const updateduser= await finduser.save()

            res.status(200).json({
                success:"true",message:"profile updated succesfully",userupdated:updateduser}
            )}
    } catch (error) {
        console.log(error.message);
        
    }


}



module.exports={
 getuserprofile,
 updateuserprofile
};