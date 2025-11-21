const jwt=require('jsonwebtoken')
const generateAcessToken=(userId)=>{
    return jwt.sign(
        {userId},
        process.env.SECRET_KEY,
        {expiresIn:'15m'}
    )
}

const generateRefreshToken=(userId)=>{
    return jwt.sign(
        {userId},
        process.env.REFRESH_TOKEN,
        {expiresIn:'7d'}
    )
}
module.exports={generateAcessToken,generateRefreshToken}