const mongoose = require('mongoose')

const signIn_Schema = new mongoose.Schema({
    first_name:{
        type:String,
        require:[true,'Name must required']
    },
    middle_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    user_name:{
      type:String,
      Request:[true,'unique username required'],
      unique:true
    },
    display_name:{
        type:String
    },
    email:{
        type:String,
        require:[true,'Email must required'],
        unique:true
    },
    password:{
        type:String,
        require:[true,'Password must required']
    },
    phone:{
        type:String,
        require:[true,'Phone must required']
    },
    dob:{
      type:String
    },
    role:{
        type:String
    },
    gender:{
        type:String,
        require:[true,'Gender must required']
    },
    address:{
        type:String,
        require:[true,'City must required']
    },
    country:{
        type:String,
        require:[true,'Country must required']
    },
    otp:{
      type:String
    },
    pic:{
        type:String
    }
})

const reader_user = new mongoose.model("reader_user",signIn_Schema)

module.exports = reader_user