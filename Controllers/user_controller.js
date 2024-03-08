const User = require('../Models/users')
const passwordValidation = require('password-validator')
const Joi = require("joi")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodeMailer = require('nodemailer')
const { json } = require('body-parser')
// const {jwtmiddleware,generateToken} = require('../jwt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "12345"




const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  tls: true,
  auth: {
    user: "abhishekp7051@gmail.com",
    pass: "kzlj lryw mbsr flat"
  }
})

let passwordSchema = new passwordValidation()
passwordSchema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()


async function userControllerSignin(req, res) {
  try {
    const signinSchema = Joi.object({
      first_name: Joi.string().required("Name must required"),
      middle_name: Joi.string(),
      last_name: Joi.string(),
      user_name: Joi.string().required("user name must be unique"),
      display_name: Joi.string(),
      email: Joi.string().email().required("Email must required "),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
      phone: Joi.string().length(10).required("Phone number must required"),
      dob: Joi.string(),
      role: Joi.string(),
      gender: Joi.string(),
      address: Joi.string(),
      country: Joi.string()
    })
    const { error } = signinSchema.validate(req.body)
    if (error) {
      res.writeHead(400)
      res.end(`${error.message}`)
    }
    
    if (await User.findOne({ email: req.body.email })) {
     
      res.writeHead(400)
      res.end("User already exist")
    } else {
      try {
        if (passwordSchema.validate(req.body.password)) {
          console.log("hii")
          let data = new User(req.body)
          bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error) {
              res.writeHead(400)
              res.end(`${error.message}`)
            } else {
              data.password = hash
              let otp = crypto.randomInt(1000, 9999)
              data.otp = otp
              const mailOptions = {
                from: "abhishekp7051@gmail.com",
                to: data.email,
                subject: "otp received ",
                text: `
            ${data.email}
            otp for validation is
             ${otp}`
              }
              transporter.sendMail(mailOptions, (error) => {
                console.log(error)
                res.writeHead(400)
                res.end(`mail not send error  ${error} `)
              })
              await data.save()
              res.writeHead(200)
              res.end(`otp send to your mail
              data is 
              ${JSON.stringify(data)}`)
            }
          })
        }else{
          res.writeHead(400)
          res.end("password must have uppercase,lowercase,two digits")
        }
      } catch (error) {
        res.writeHead(400)
        res.end("password must have uppercase,lowercase,two digits")
      }
    }
  } catch (error) {
    console.log(error)
    res.writeHead(400)
    res.end(`${error.message}`)
  }
}



async function userControllerGetAllData(req, res) {
  try {
    const data = await User.findOne({ email: req.body.email })
    res.writeHead(200)
    res.end(`${JSON.stringify(data)}`)
  } catch (error) {
    res.writeHead(400)
    res.end(`${error}`)
  }
}

async function userConterollerUpdateUser(req, res) {
  try {
    //  await upload.single("pic")
    const data = await User.findOne({ email: req.body.email });
    console.log(data)
    if (data) {
      data.name = req.body.name ?? data.name
      data.phone = req.body.phone ?? data.phone
      data.role = req.body.role ?? data.role
      data.gender = req.body.gender ?? data.gender
      data.country = req.body.country ?? data.country

      // try {
      //   if(req.file.filename && data.pic){
      //         fs.unlinkSync('public/users/'+data.pic)

      //         data.pic = req.file.filename
      //   }
      // } catch (error) {
      //   rmSync.end("pic not find")
      // }
      await data.save()
      res.writeHead(200)
      res.end(`record id updated `)
    }
  } catch (error) {
    res.writeHead(400)
    res.end(`${error}`)
  }
}



async function userControllerLogin(req, res) {
  try {
    const loginSchema = Joi.object({
      email: Joi.string().email().required("Email must required "),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
    })

    const { error } = loginSchema.validate(req.body)
    if (error) {
      res.writeHead(400)
      res.end(`${error.message}`)
    }
    let data = await User.findOne({ email: req.body.email });
    if (data) {
      if (await bcrypt.compare(req.body.password, data.password)) {
        const token = await jwt.sign({ user_id: data._id }, JWT_SECRET)
        console.log(token)
        res.writeHead(200)
        res.end(JSON.stringify(`${data} ${token}`))
      } else {
        res.writeHead(400)
        res.end("invalid password")
      }
    } else {
      res.writeHead(400)
      res.end("invalid userid or password")
    }
  } catch (error) {
    res.writeHead(400)
    res.end(`${error.message}`)
  }
}

async function verifyOtp(req, res) {
  try {
    const verifyOtpSchema = Joi.object({
      email: Joi.string().email().required("Email must required "),
      otp: Joi.string().length(4).required("Otp must Required")
    })
    const { error } = verifyOtpSchema.validate(req.body)
    if (error) {
      res.writeHead(400)
      res.end(`${error}`)
    }

    const data = await User.findOne({ email: req.body.email })
    if (data) {
      if (data.otp === req.body.otp) {
        res.writeHead(200)
        res.end(`record created`)
      } else {
        res.writeHead(400)
        res.end(`wrong otp`)
      }
    } else {
      res.writeHead(400)
      res.end('email not exist')
    }
  } catch (error) {
    res.writeHead(400)
    res.end(`${error.message}`)
  }
}


async function resendOtp(req, res) {
  try {
    const resendOtpSchema = Joi.object({
      email: Joi.string().email().required("Email must required "),
    })

    const { error } = resendOtpSchema.validate(req.body)
    if (error) {
      res.writeHead(400)
      res.end(`${error}`)
    }

    const data = await User.findOne({ email: req.body.email })
    if (data) {
      const otp = crypto.randomInt(1000, 9999)
      const mailOptions = {
        from: "abhishekp7051@gmail.com",
        to: data.email,
        subject: "otp received ",
        text: `
  ${data.email}
  otp for validation is
   ${otp}`
      }
      transporter.sendMail(mailOptions, (error) => {
        console.log(error)
        res.writeHead(400)
        res.end(`mail not send error  ${error} `)
      })

      try {
        await User.findByIdAndUpdate(data._id, { otp: otp })
        res.writeHead(200)
        res.end(`otp send to email`)
        console.log(data)
      } catch (error) {
        res.writeHead(400)
        res.end(`${error.message}`)
      }
    } else {
      res.writeHead(400)
      res.end(`email not exist`)
    }
  } catch (error) {
    res.writeHead(400)
    res.end(`${error.message}`)
  }
}


async function forgotPassword(req, res) {

  try {
    const forgotPasswordSchema = Joi.object({
      email: Joi.string().email().required("Email must required "),
    })

    const { error } = forgotPasswordSchema.validate(req.body)
    if (error) {
      res.writeHead(400)
      res.end(`${error}`)
    }
    try {
      const data = await User.findOne({ email: req.body.email })
      const otp = crypto.randomInt(1000, 9999)
      const mailOptions = {
        from: "abhishekp7051@gmail.com",
        to: data.email,
        subject: "otp received ",
        text: `
       ${data.email}
        otp for validation is
        ${otp}`
      }
      transporter.sendMail(mailOptions, (error) => {
        console.log(error)
        res.end(`mail not send error  ${error} `)
      })
      try {
        await User.findByIdAndUpdate(data._id, { otp: otp })
        res.writeHead(200)
        res.end(`otp send to email`)
      } catch (error) {
        res.writeHead(400)
        res.end(`${error.message}`)
      }
    } catch (error) {
      res.writeHead(400)
      res.end(` email not exist or ${error}`)
    }
  } catch (error) {
    res.end(`${error}`)

  }
}


async function resetPassword(req, res) {
  try {
    const resetPasswordSchema = Joi.object({
      email: Joi.string().email().required("Email must required "),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
    })
    const { error } = resetPasswordSchema.validate(req.body)
    if (error) {
      res.writeHead(400)
      res.end(`${error}`)
    }

    try {
      const data = await User.findOne({ email: req.body.email })
      if (data) {
        let newpassword = req.body.password
        await User.findOneAndUpdate(data._id, { password: newpassword })
        const newData = await User.findOne({ email: req.body.email })
        const hashnewPassword = await bcrypt.hash(newData.password, 12)
        newData.password = hashnewPassword
        newData.save()
        res.writeHead(200)
        res.end(`${JSON.stringify(newData)}`)


      } else {
        res.writeHead(400)
        res.end(`email not exist`)
      }
    } catch (error) {
      res.writeHead(400)
      res.end(`${error}`)
    }

  } catch (error) {
    res.writeHead(400)
    res.end(`${error}`)
  }

}





module.exports = { userControllerSignin, userControllerLogin, verifyOtp, resendOtp, forgotPassword, resetPassword, userControllerGetAllData, userConterollerUpdateUser }