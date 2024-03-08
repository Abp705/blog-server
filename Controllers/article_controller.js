const Article = require('../Models/articles')
const User = require('../Models/users')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "12345"

async function create_article(req, res) {

    try {
        // const verifyUser = async(req, res, next) => {
        //     const token = req.headers.authorization
        //     console.log(token)
        //     const decode = await jwt.verify(token,JWT_SECRET)
        //     console.log(decode)

        //     if (decode) {
        //         console.log(decode)
        //         next()
        //     }
        //     else {
        //         console.log("hii")
        //         res.writeHead(400)
        //         res.end(`you are not authorized to access this API...`)
        //     }
        // }

        // verifyUser(req,res)
        const token = req.headers.authorization
        if (!token) {
            res.writeHead(400)
            res.end('unauthorized user')
        }
        const decode = await jwt.verify(token, JWT_SECRET)
        if (!decode) {
            res.writeHead(400)
            res.end('unauthorized user')
        }

        const user = await User.findOne({ _id: decode.user_id })
        console.log(user)
        if (!user) {
            res.writeHead(400)
            res.end('user not exist')
        }
        const article_schema = Joi.object({
            title: Joi.string().required("Plese enter title of article"),
            article: Joi.string().required("Plese enter the article")
        })
        const { error } = article_schema.validate(req.body)
        if (error) {
            res.writeHead(400)
            res.end(`${error.message}`)
        } else {
            const auther_id = user._id
            const auther = user.display_name
            console.log(auther_id)
            console.log(auther)
            const data = await new Article({ ...req.body, auther_id, auther })
            data.save()
            res.end(`${data}`)
        }

    } catch (error) {
        console.log(error)
        res.end(`${error.message}`)
    }
}

async function delete_article(req, res) {
    try {
        const token = req.headers.authorization
        if (!token) {
            res.writeHead(400)
            res.end('Unauthorized user')
        }
        const decode = await jwt.verify(token, JWT_SECRET)
        if (!decode) {
            res.writeHead(400)
            res.end('Unauthorized user')
        }
        console.log(decode.user_id)
        const { _id } = req.body
        const data = await Article.findOne({ _id: _id })
        console.log(data.auther_id)
        if (!data) {
            res.writeHead(400)
            res.end(`aeticle not exist`)
        }
        if (data.auther_id === decode.user_id) {
            if (await Article.findOneAndUpdate({ _id: _id }, { isDeleted: true })) {
                res.writeHead(200)
                res.end(` article soft delete succesfully, ${data}`)
            } else {
                res.writeHead(400)
                res.end(` Article not found , ${data}`)
            }
        } else {
            res.writeHead(400)
            res.end(`you have not authority to delete article`)
        }
    } catch (error) {
        console.log(error)
        res.writeHead(400)
        res.end(`${error.message}`)
    }
}

async function update_article(req, res) {
    try {
        const token = req.headers.authorization
        if (!token) {
            res.writeHead(400)
            res.end(`Unauthorized user`)
        }

        const decoded = await jwt.verify(token, JWT_SECRET)
        if (!decoded) {
            res.writeHead(400)
            res.end(`Unauthorized user`)
        }
        console.log(decoded.user_id)

        const _id = req.body
        const data = await Article.findOne({ _id: _id })
        console.log(data)
        if (data.auther_id === decoded.user_id) {
            data.title = req.body.title ?? data.title
            data.article = req.body.article ?? data.article
            data.save()
            res.end(`${data}`)
        } else {
            res.writeHead(400)
            res.end(`you have not authority to update article `)
        }

    } catch (error) {
        res.writeHead(400)
        res.end(error.message)
    }
}



async function get_article(req, res) {
    try {
        const token = req.headers.authorization
        if (!token) {
            res.writeHead(400)
            res.end(`you have not authority to get article`)
        }
        const decoded = await jwt.verify(token, JWT_SECRET)
        if (!decoded) {
            res.writeHead(400)
            res.end(`you have not authority to get article`)
        }
        console.log(decoded)
        const data = await Article.find({ auther_id: decoded.user_id })
        if (data) {
            console.log(data)
            res.writeHead(200)
            res.end(`${data}`)
        } else {
            res.writeHead(400)
            res.end(`Article not exist `)
        }
    } catch (error) {
        res.writeHead(400)
        res.end(`${error.message}`)
    }
}




module.exports = { create_article, delete_article, update_article, get_article }