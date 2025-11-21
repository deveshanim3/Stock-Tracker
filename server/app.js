require('dotenv').config()
const express=require('express')
const cors=require('cors')
const connectDB=require('./database/connection')
const cookieParser = require('cookie-parser')
const authRoutes=require('./router/auth.Route')
const app=express()

app.use(express.json())
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

connectDB()

app.get('/health',(req,res)=>{
    res.status(200).send({success:"Server is ready",Time:Date.now()})
})

app.use('/auth',authRoutes);
app.listen(process.env.PORT||3000,()=>{
    console.log(`Server is running on 3000 \nhttp://localhost:${process.env.PORT}`);
    
    console.log(`${process.env.MONGO_URI} \n  \n ${process.env.SECRET_KEY} \n ${process.env.REFRESH_TOKEN}`) 
})