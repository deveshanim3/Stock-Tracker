const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
            'Please fill a valid email address'
        ]
    },
    password:{
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    
    
})

module.exports=mongoose.model('User',userSchema);