const jwt = require('jsonwebtoken')

const JWT_SECRET = 12345



//  jwt middle ware 
const jwtmiddleware = (req, res, next) => {
    const token = req.headers.autorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'unauthorized' })
    try {
        const decoded = jwt.verify(token, process.env.jWT_SECRET)
        if (!decoded) {
            res.status(401)
            res.end('authentication failed')
        }
        console.log(decoded)
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Invalid Token' })
    }
}



// function to generate jwt token

const generateToken = (useData) => {
    return jwt.sign(userData, JWT_SECRET)
}

module.exports = { jwtmiddleware, generateToken }





