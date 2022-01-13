import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Tokens from '../../../models/tokenModel'
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { postData } from '../../../utils/fetchData';
import moment from 'moment';
import { CONTACT_ADMIN_ERR_MSG, PASSWORD_RESET_MAIL } from '../../../utils/constants';


connectDB()
/*
    POST - Public
*/

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await forgotPassword(req, res)
            break;
    }
}


const forgotPassword = async (req, res) => {
    try {
        const { email, hostName, hostType } = req.body;

        const user = await Users.findOne({ email });
        if (!user) return res.status(401).json({ err: 'This user does not exist.' });
        // if (!user.activated) return res.status(401).json({ err: 'Please activate your account to proceed further.'});

        const resetToken = await generateNewToken(user._id, res);

        const isMailSent = await mailResetPasswordLink(user._id, user.name, email, resetToken, hostName, hostType, res);

        if (isMailSent) return res.status(200).json({ success: true });
        else return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG });

    } catch (err) {
        console.error('Error occurred while forgotPassword: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const generateNewToken = async (userId, res) => {
    try {
        const token = await Tokens.findOne({ userId })
        if (token) await Tokens.deleteMany({ userId });

        let resetToken = crypto.randomBytes(60).toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, 12);

        await new Tokens({
            userId,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: moment().add(20, 'minutes') 
        }).save();

        return hashedToken;
    } catch (err) {
        console.error('Error occurred while generateNewToken: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const mailResetPasswordLink = async (userId, userName, email, resetToken, hostName, hostType, res) => {

    try {
        const resMail = await postData(
            'mail',
            {
                baseUrl: process.env.NEXT_PUBLIC_BASE_URL ,
                forgotPasswordUrl: `/resetPassword?rt=${encodeURIComponent(resetToken)}&id=${userId}`,
                email,
                mailType: PASSWORD_RESET_MAIL,
                subject: 'Password Reset Request',
                userName,
                hostName,
                type: hostType
            }
        )

        if (resMail.err) return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG });

        return resMail.info && resMail.info === 'Mail Sent!';

    } catch (err) {
        console.error('Error occurred while mailResetPasswordLink: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}