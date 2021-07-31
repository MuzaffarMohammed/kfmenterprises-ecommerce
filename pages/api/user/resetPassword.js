import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import auth from '../../../middleware/auth'
import bcrypt from 'bcrypt'

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

        const { password, urlPwdResetFlag, userid } = req.body
        let result = {};
        if (!urlPwdResetFlag) {
            result = await auth(req, res)
        } else {
            result = { id: userid }
        }
        const passwordHash = await bcrypt.hash(password, 12)

        await Users.findOneAndUpdate({ _id: result.id }, { password: passwordHash })

        res.json({ msg: "Password Updated Successfully!" })

    } catch (err) {
        console.log('Error occurred while resetPassword: ' + err);
        return res.status(500).json({ err: err.message })
    }
}