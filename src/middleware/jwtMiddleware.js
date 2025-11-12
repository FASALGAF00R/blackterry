const jwt=require('jsonwebtoken')
function verifyToken(req,res,next){
const token=req.headers['authorization'];
try {
    if(!token){
        return res.status(403).json({message:"No token provided"});
    }else{
        const bearertoken=token.split(" ")[1];
        
        if(!bearertoken){
            return res.status(403).json({message:"No token provided"});
        }

        const decoded=jwt.verify(bearertoken,process.env.JWT_SECRET);
        req.userId=decoded.id;
        next();
    }
    
} catch (error) {
  res.status(401).json({ error: 'Invalid token' });   
}
}

module.exports=verifyToken;