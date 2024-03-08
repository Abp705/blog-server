const Category = require('../Models/category')
const User = require('../Models/users')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "12345"

async function create_category(req, res) {
    try {
        const token = req.headers.authorization
        if (!token) {
            res.writeHead(400)
            res.end(`you are not authorized to create category`)
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        if (!decoded) {
            res.writeHead(400)
            res.end(`you are not authorized to create category`)
        }
        console.log(decoded)
        const user = await User.findOne({ _id: decoded.user_id })
        if (!user) {
            res.writeHead(400)
            res.end(`admin not found`)
        }
        if (user.role == "admin") {
            const data = await new Category(req.body)

            console.log(data)
            data.save()
            res.end(`${data}`)
        } else {
            res.writeHead(400)
            res.end(`only admin can create categoty`)
        }
    } catch (error) {
        res.writeHead(400)
        res.end(`${error.message}`)
    }
}

async function delete_category(req, res) {
    try {
        const token = req.headers.authorization
        if (!token) {
            res.writeHead(400)
            res.end(`you are not authorized to create category`)
        }

        const decode = jwt.verify(token, JWT_SECRET)
        if (!decode) {
            res.writeHead(400)
            res.end(`you are not authorized to create category`)
        }
        console.log(decode)
        const user = await User.findOne({ _id: decode.user_id })
        if (!user) {
            res.writeHead(400)
            res.end(`user not found`)
        }
        if (user.role == "admin") {
            const _id = req.body
            if (!_id) {
                res.writeHead(400)
                res.end(`category not found`)
            }
            await Category.findOneAndUpdate({ _id: _id }, { isDeleted: true })
            res.writeHead(200)
            res.end(`user is deleted`)
        } else {
            res.writeHead(400)
            res.end(`only admin can delete category`)
        }

    } catch (error) {
        res.writeHead(400)
        res.end(`${error.message}`)
    }
}

async function update_category(req, res) {
    try {
        const token = req.headers.authorization

        if (!token) {
            res.writeHead(400)
            res.end(`you are not authorozed to update the category`)
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        if (!decoded) {
            res.writeHead(400)
            res.end(`you are not authorozed to update the category`)
        }
        const user = await User.findOne({ _id: decoded.user_id })
        if (!user) {
            res.writeHead(400)
            res.end(`you are not authorized to update the category `)
        }
        if (user.role == "admin") {
            const { _id } = req.body
            if (!_id) {
                res.writeHead(400)
                res.end('category not found')
            }

            const data = await Category.findOne({ _id: _id })
            if (!data) {
                res.writeHead(400)
                res.end(`category not exist!!!!`)
            }

            data.category_name = req.body.category_name ?? data.category_name
            data.save()
            res.writeHead(200)
            res.end(`category updated ${data}`)
        } else {
            res.writeHead(400)
            res.end(`only admin can updae the category`)
        }

    } catch (error) {
        res.writeHead(400)
        res.end(`${error.message}`)
    }
}


async function get_category(req, res) {
    try {
        const data = await Category.find({ isDeleted: false })
        if (!data) {
            res.writeHead(400)
            res.end(`category not exist!!!`)
        }
        res.writeHead(200)
        res.end(`category are ${data} `)
    } catch (error) {
        res.writeHead(400)
        res.end(`${error.message}`)
    }
}





module.exports = { create_category, delete_category, update_category, get_category }