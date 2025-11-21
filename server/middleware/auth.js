const jwt=require('jsonwebtoken')
const secretKey=process.env.secretKey||'Devesh'

const authenticationToken =(req,res,next)=>{
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).josn({message: 'Access token required'})
    }

    jwt.verify(token,secretKey,(err,decoded)=>{
        if(err){
            return res.status(403).json({message: 'Invalid or expired access token'})
        }
        req.userId=decoded.userId
        next()
    })
}
module.exports={authenticationToken}