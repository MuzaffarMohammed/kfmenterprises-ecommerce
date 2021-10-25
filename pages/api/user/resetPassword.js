import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Tokens from '../../../models/tokenModel'
import auth from '../../../middleware/auth'
import bcrypt from 'bcrypt';
import { CONTACT_ADMIN_ERR_MSG } from '../../../utils/constants'

connectDB()

/*
    PATCH    - Unprotected
*/

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await resetPassword(req, res)
            break;
    }
}


const resetPassword = async (req, res) => {
    try {

        const { password, urlPwdResetFlag, id: userId, rt: resetToken } = req.body
        let result = {};
        if (!urlPwdResetFlag) {
            result = await auth(req, res)
        } else {
            result = { id: userId }
            await validateResetToken(decodeURIComponent(resetToken), userId, res);
        }
        const passwordHash = await bcrypt.hash(password, 12)

        await Users.findOneAndUpdate({ _id: result.id }, { password: passwordHash, passwordChanged: true })

        res.json({ msg: "Password Updated Successfully!" })

    } catch (err) {
        console.error('Error occurred while resetPassword: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const validateResetToken = async (token, userId, res) => {
    try {
        const passwordResetToken = await Tokens.findOne({ userId }).sort({ createdAt: -1 });
        if (!passwordResetToken) return res.status(401).json({ err: "Invalid request!" })
        const isValid = token === passwordResetToken.token;
        if (!isValid) return res.status(401).json({ err: "Invalid request!" });
        else await Tokens.deleteMany({ userId });
    } catch (err) {
        console.error('Error occurred while validateResetToken: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}