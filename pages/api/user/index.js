import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_401 } from '../../../utils/constants'

connectDB()

/*
    PATCH    - Protected
    GET    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await uploadInfor(req, res)
            break;
        case "GET":
            await getUsers(req, res)
            break;
    }
}

const getUsers = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin')
            return res.status(401).json({ err: ERROR_401 })

        const users = await Users.find().select('-password')
        res.json({ users })

    } catch (err) {
        console.error('Error occurred while getUsers: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}


const uploadInfor = async (req, res) => {
    try {
        const result = await auth(req, res)
        const { name, avatar } = req.body

        const newUser = await Users.findOneAndUpdate({ _id: result.id }, { name, avatar })

        res.json({
            msg: "Update Success!",
            user: {
                name,
                avatar,
                email: newUser.email,
                role: newUser.role,
                activated: newUser.activated
            }
        })
    } catch (err) {
        console.error('Error occurred while uploadInfor: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}