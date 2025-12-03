const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/schema/User.model');
const {generateAcessToken,generateRefreshToken}=require('../utils/tokenUtils');


//Register user
const register=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({ message: 'Email and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const user=new User({
            email,
            password:hashedPassword
        })
        console.log("Request body:", req.body);
        const accessToken=generateAcessToken(user._id)
        const refreshToken=generateRefreshToken(user._id)
        user.refreshToken=refreshToken

        await user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: '/',
        });

        res.status(201).json({ 
        message: 'User registered successfully',
        accessToken,
        user: { id: user._id, email: user.email }
        });
        

    }catch(error){
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
        console.log("Request body:", req.body);

    }
}

//Login user
const login=async(req,res)=>{
    try {
        const {email,password}=req.body

        if(!email||!password){
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const userExists=await User.findOne({email})

        if(!userExists){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword=await bcrypt.compare(password,userExists.password)

        if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }

        //generate token
        const accessToken=generateAcessToken(userExists._id)
        const refreshToken=generateRefreshToken(userExists._id)

        userExists.refreshToken=refreshToken;
        await userExists.save()
        console.log("Generated Access Token:", accessToken);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        })
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
            path: '/',
        });

        res.json({accessToken,
        message: 'Login successful',
        user: { 
        id: userExists._id, 
        email: userExists.email 
        }
    })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//refresh token
const refreshToken=async(req,res)=>{
    try {
        const {refreshToken}=req.cookies

        if(!refreshToken){
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN)

        const user=await User.findById(decoded._id)

        if(!user ||user.refreshToken !== refreshToken){
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        const accessToken=generateAcessToken(user._id)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes again
            path: '/',
        });

        res.json({accessToken,
            user:{ 
                id:user._id,
                email:user.email
            }
        })
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
}

//logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    //console.log(refreshToken)
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
       console.log(decoded)
      await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
    }
    
    res.clearCookie('refreshToken',{ path: "/" });

    res.json({ message: 'Logout successful' });
    console.log("Logout success")

  } catch (error) {

    console.log('Logout error:', error);
    res.clearCookie('refreshToken',{ path: "/" });
    res.json({ message: 'Logout successful' });
  }
};
module.exports={register,login,refreshToken,logout}