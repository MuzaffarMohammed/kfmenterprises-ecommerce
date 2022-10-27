import connectDB from '../../../utils/connectDB'
import { ACC_ACT_MAIL, CONTACT_ADMIN_ERR_MSG } from '../../../utils/constants'
import Users from '../../../models/userModel'
import { valid } from '../../../utils/valid'
import { postData } from '../../../utils/fetchData'
import bcrypt from 'bcrypt'


connectDB()
/*
    POST - public
*/
export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await register(req, res)
            break;
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password, cf_password } = req.body

        const errMsg = valid(name, email, password, cf_password)
        if (errMsg) return res.status(400).json({ err: errMsg })

        const userExist = await Users.findOne({ name: name.toLowerCase() })
        if (userExist) return res.status(400).json({ err: 'This user name already taken.' })

        const emailExist = await Users.findOne({ email: email.toLowerCase() })
        if (emailExist) return res.status(400).json({ err: `Your provided Email address ${email} has already been used. Please use another Email address.`, delay: 12000 })

        const passwordHash = await bcrypt.hash(password, 12)

        const newUser = new Users({
            name: name.toLowerCase(), email: email.toLowerCase(), password: passwordHash, cf_password, activated: false
        })
        const addedUser = await newUser.save()
        const { _id: id, name: userName } = addedUser;
        postData('mail', { id, userName, email, mailType: ACC_ACT_MAIL, subject: 'Account Activation Request' })
        res.json({ msg: "Registration Successful, an email has been sent to your mail address, please activate your account to continue shopping.", delay: 12000 })

    } catch (err) {
        console.error('Error occurred while register: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}