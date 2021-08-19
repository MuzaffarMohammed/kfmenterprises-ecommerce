import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken'


connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await login(req, res)
            break;
    }
}

const login = async (req, res) => {
    try {
        const { userName: email, password } = req.body
        let user = await Users.findOne({ email })
        if (!user) user = await Users.findOne({ name: email })
        if (!user) return res.status(401).json({ err: 'Incorrect User Name/Password.' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ err: 'Incorrect User Name/Password.' })

        const access_token = createAccessToken({ id: user._id })
        const refresh_token = createRefreshToken({ id: user._id })

        res.json({
            msg: "Login Success!",
            refresh_token,
            access_token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root,
                activated: user.activated
            }
        })

    } catch (err) {
        console.error('Error occurred while login: ' + err);
        return res.status(500).json({ err: err.message })
    }
}