import connectDB from '../../../utils/connectDB'
import { ORDER_MAIL, ACC_ACT_MAIL, CONTACT_MAIL, ORDER_ADMIN_MAIL, ORDER_CONFIRMATION_MAIL, PASSWORD_RESET_MAIL, ORDER_DELIVERED_MAIL, CONTACT_ADMIN_ERR_MSG } from '../../../utils/constants'
import nodemailer from 'nodemailer'
import { orderMail } from '../../../utils/orderMail'
import { accountActivationMail } from '../../../utils/accountActivationMail'
import { contactMail } from '../../../utils/contactMail'
import { orderAdminMail } from '../../../utils/orderAdminMail'
import { orderConfirmationMail } from '../../../utils/orderConfirmationMail'
import { restPasswordMail } from '../../../utils/resetPasswordMail'
import { orderDeliveredMail } from '../../../utils/orderDeliveredMail'
import auth from '../../../middleware/auth'


connectDB()

/*
    ORDER_MAIL              - Protected
    ACC_ACT_MAIL            - Protected
    CONTACT_MAIL            - Protected
    ORDER_ADMIN_MAIL        - Protected
    ORDER_CONFIRMATION_MAIL - Protected
    PASSWORD_RESET_MAIL     - Public
    ORDER_DELIVERED_MAIL    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await sendMail(req, res)
            break;
    }
}

const sendMail = async (req, res) => {
    let fromMailId = process.env.NEXT_PUBLIC_ADMIN_ID;
    let toMailId = process.env.NEXT_PUBLIC_ADMIN_ID;
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: fromMailId,
                pass: process.env.NEXT_PUBLIC_MAIL_AUTH
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let output = '';
        const mailType = req.body.mailType;
        switch (mailType) {
            case ORDER_MAIL:
                await auth(req, res);
                output = orderMail(req);
                toMailId = req.body.email;
                break;
            case ACC_ACT_MAIL:
                await auth(req, res);
                output = accountActivationMail(req);
                toMailId = req.body.email;
                break;
            case CONTACT_MAIL:
                await auth(req, res);
                output = contactMail(req);
                fromMailId = req.body.email;
                break;
            case ORDER_ADMIN_MAIL:
                await auth(req, res);
                output = orderAdminMail(req);
                toMailId = req.body.email;
                break;
            case ORDER_CONFIRMATION_MAIL:
                await auth(req, res);
                output = orderConfirmationMail(req);
                toMailId = req.body.email;
                break;
            case PASSWORD_RESET_MAIL:
                output = restPasswordMail(req);
                toMailId = req.body.email;
                break;
            case ORDER_DELIVERED_MAIL:
                output = orderDeliveredMail(req);
                toMailId = req.body.email;
                break;        
            default:
        }

        console.log('Sending Mail : ', "From -", fromMailId, "To - ", toMailId);

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
                console.error('Error occurred in Mail System transporter : ', error)
                return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG });
            }
            console.log('Message sent: %s', info.accepted);   
            return info;
        });
        return res.status(200).json({ info: 'Mail Sent!' });
    } catch (err) {
        console.error('Error occurred while sendMail: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}