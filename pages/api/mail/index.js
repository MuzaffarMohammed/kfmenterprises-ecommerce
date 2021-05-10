import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import auth from '../../../middleware/auth'
import nodemailer from 'nodemailer'
import {orderMail} from '../../orderMail'

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

        const orderOutput = orderMail(req);
        
        const output = `
            <h3> Hello ${req.body.userName} </h3>
            <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
            <p>To activate your account please follow this link: <a target="_" href="${process.env.NEXT_PUBLIC_BASE_URL}/api/user/accountActivation/${req.body.id}">${process.env.NEXT_PUBLIC_BASE_URL}/api/user/accountActivation</a></p>
            </br>
            <h3>Happy Shopping</h3>
            </br>
            <p>Cheers</p>
            <p>KFM Cart Team</p>
        `;

        // setup email data with unicode symbols
        let mailOptions = {
            from: '<No Reply> kfmcart@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: 'KFM Cart: Account Activation Request', // Subject line
            // text: 'Hello world?', // plain text body
            html: orderOutput // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return console.log(error)
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.status(200).json({info: 'Mail Sent!'});
        });



    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}