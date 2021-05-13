import connectDB from '../../../utils/connectDB'
import {ORDER_MAIL, ACC_ACT_MAIL} from '../../../utils/constants'
import Users from '../../../models/userModel'
import auth from '../../../middleware/auth'
import nodemailer from 'nodemailer'
import {orderMail} from '../../../utils/orderMail'
import {accountActivationMail} from '../../../utils/accountActivationMail'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await sendMail(req, res)
            break;
    }
}

const sendMail = async (req, res) => {
    try {
       // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'kfmcart@gmail.com', 
                pass: 'kfmcart123'
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        let output = '';
        const mailType = req.body.mailType;
        console.log(ACC_ACT_MAIL)
        if(mailType === ORDER_MAIL){
            output = orderMail(req);
        }else if(mailType === ACC_ACT_MAIL){
            output = accountActivationMail(req);
        }

        // setup email data with unicode symbols
        let mailOptions = {
            from: '<No Reply> kfmcart@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: `KFM Cart - ${req.body.subject}`, // Subject line
            // text: 'Hello world?', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return console.log(error)
            console.log('Message sent: %s', info.messageId);   
            res.status(200).json({info: 'Mail Sent!'});
        });



    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}