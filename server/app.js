require('dotenv').config()
const express=require('express')
const cors=require('cors')
const connectDB=require('./database/connection')
const cookieParser = require('cookie-parser')
const authRoutes=require('./router/auth.Route')
const app=express()
const watchlist=require('./router/watchlist.route')
const holding=require('./router/holding.route')

app.use(express.json())
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ["http://localhost:5173",process.env.BASE_URL],
  credentials: true,
}));


connectDB()

app.get('/health',(req,res)=>{
    res.status(200).send({success:"Server is ready",Time:Date.now()})
})

app.use('/auth',authRoutes);
app.use('/watch',watchlist)
app.use('/hold',holding)

app.listen(process.env.PORT||3000,()=>{
    console.log(`Server is running on 3000 \nhttp://localhost:${process.env.PORT}`);
    
    console.log(`${process.env.MONGO_URI} \n  \n ${process.env.SECRET_KEY} \n ${process.env.REFRESH_TOKEN}`) 
})