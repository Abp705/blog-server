const http = require("http")
const {handleRouts} = require('./Routes/index')
const bodyParser = require('body-parser')
const getConnect = require("./dbConnect")
const jasonParser = bodyParser.json()
getConnect()

const server = http.createServer((req,res)=>{
    jasonParser(req,res, function(){
        handleRouts(req,res)
    }) 
})

server.listen(8000,console.log('server is running at port http://localhost:8000'))
