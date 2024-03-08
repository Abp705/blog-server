const mongoose = require('mongoose')


const category_schema = new mongoose.Schema({
    category_name:{
        type:String,
        require:true,
        unique:true
    },
    date:{
        type:Date,
        dafault:Date.now
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const category_name = new mongoose.model("category_name",category_schema)
module.exports = category_name