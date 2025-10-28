const jwt=require('jsonwebtoken')
function verifyToken(req,res,next){{
const token=req.headers['authorization'];
console.log(token,"tokennn");
try {
    if(!token){
        return res.status(403).json({message:"No token provided"});
    }else{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.id;
        next();
        console.log("okkkkkkkkkkkkk");
    }
    
} catch (error) {
  res.status(401).json({ error: 'Invalid token' });   
}
}}

module.exports=verifyToken;