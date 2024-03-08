
const mongoose = require("mongoose")

async function getConnect(){
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/blogging_Server")
        console.log("server is connected ")
    } catch (error) {
        console.log(error)
    }
}

module.exports = getConnect

