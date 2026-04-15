const jwt=require('jsonwebtoken');
const authMiddleware=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({error:'Access denied. please login first'});
    }
    try{
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verified;
        next();
    }catch(err){
        return res.status(401).json({error:'Invalid token'});
    }
};
module.exports=authMiddleware;