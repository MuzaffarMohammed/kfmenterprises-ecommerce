import connectDB from '../../../utils/connectDB'
import {ORDER_MAIL, ACC_ACT_MAIL, CONTACT_MAIL} from '../../../utils/constants'
import nodemailer from 'nodemailer'
import {orderMail} from '../../../utils/orderMail'
import {accountActivationMail} from '../../../utils/accountActivationMail'
import {contactMail} from '../../../utils/contactMail'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await sendMail(req, res)
            break;
    }
}

const sendMail = async (req, res) => {
    let fromMailId = 'kfmcart@gmail.com';
    let toMailId = 'kfmcart@gmail.com';
    try {
       // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: fromMailId, 
                pass: 'kfmcart123'
            },
            tls:{
                rejectUnauthorized:false
            }
        });

        let output = '';
        const mailType = req.body.mailType;        
        switch(mailType){
            case ORDER_MAIL:
                output = orderMail(req);
                toMailId = req.body.email;
                break;
            case ACC_ACT_MAIL:
                output = accountActivationMail(req);
                toMailId = req.body.email;
                break;
            case CONTACT_MAIL:
                output = contactMail(req);
                fromMailId = req.body.email;
                break;
            default:

        }

        // setup email data with unicode symbols
        let mailOptions = {
            from: fromMailId, // sender address
            to: toMailId, // list of receivers
            subject: `KFM Cart - ${req.body.subject}`, // Subject line
            // text: 'Hello world?', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred in Mail System transporter : ', error)
                return res.status(500).json({err: err.message})
            }
            console.log('Message sent: %s', info.messageId);   
            res.status(200).json({info: 'Mail Sent!'});
        });
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}