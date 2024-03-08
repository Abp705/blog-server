const { boolean } = require('joi')
const mongoose = require('mongoose')

const article_schema = new mongoose.Schema({
    auther_id: {
        type: String,
        require: true
    },
    auther:{
        type:String,
        require:true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    article: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })


const article_post = mongoose.model('article_post', article_schema)

module.exports = article_post