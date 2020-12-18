const jwt=require('jsonwebtoken');

module.exports=function(req,res,next){
    // Get Token
    const token= req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg:'No Token found...'})
    }
    try{
        const decodetoken=jwt.verify(token,process.env.SecretKey);
        req.user=decodetoken.user;
        next();

    }catch(err){
        res.status(401).json({msg:'Token is Invalid'});
    } 
}