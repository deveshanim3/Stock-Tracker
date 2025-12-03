const jwt=require('jsonwebtoken')
const generateAcessToken=(id)=>{
    return jwt.sign(
        { _id: id},
        process.env.SECRET_KEY,
        {expiresIn:'15m'}
    )
}

const generateRefreshToken=(id)=>{
    return jwt.sign(
        { _id: id},
        process.env.REFRESH_TOKEN,
        {expiresIn:'7d'}
    )
}
module.exports={generateAcessToken,generateRefreshToken}