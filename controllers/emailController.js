const nodeMailer = require('nodemailer')
const asyncHandler = require("express-async-handler")
const smtpTransport = require('nodemailer-smtp-transport');
const sendMail = asyncHandler(async(data,req,res) => {
    let transporter = nodeMailer.createTransport(smtpTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_ID,
            pass:process.env.PW
        }
    }))

    let info = await transporter.sendMail({
        from: process.env.MAIL_ID,
        to:data.to,
        subject:data.subject,
        text:data.text,
        html:data.htm
    })
    console.log(info);
})

module.exports = {sendMail}