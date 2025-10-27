const User = require('./userModel');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    try {
        console.log("entered");
        const { name, email, password } = req.body; 
        console.log(req.body,"reqbody");
        const existing = await User.findOne({email})
        console.log(existing,"existing");
        if(existing){
            res.json({message: "User already exists"})
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({name, email, password: hashedPassword});
            console.log(user,"user");
            await user.save();
            res.status(201).json({message: "User registered successfully"})
        }
    }catch{
        console.log(console.error);
    }
}

const loginUser=async(req,res)=>{
    try {
        const{email,password}=req.body
        console.log(email,password,"........");
        
        const finduser=User.find({email})
        console.log(finduser,"finduserrrrrrrrr");
        if(finduser){
            return res.status(200).json({message:"user verfied"})
        }else{
            return res.json({message:"no user found"})
        }
        
    } catch (error) {
        console.log(error);  
    }



}




module.exports = { registerUser ,
    loginUser
};