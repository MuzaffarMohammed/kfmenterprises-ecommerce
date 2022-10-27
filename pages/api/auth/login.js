import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import Tokens from '../../../models/tokenModel'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken'
import { CONTACT_ADMIN_ERR_MSG, INVALID_LOGIN } from '../../../utils/constants'
import moment from 'moment'

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
        if (!user) return res.status(401).json({ err: INVALID_LOGIN })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ err: INVALID_LOGIN })

        const access_token = createAccessToken({ id: user._id })

        const refreshTokenId = crypto.randomBytes(16).toString('hex');
        const refresh_token = createRefreshToken({ id: user._id, refreshTokenId })

        saveRefreshToken(refreshTokenId, user._id, refresh_token);

        res.json({
            msg: "Login successful.",
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
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const saveRefreshToken = async (refreshTokenId, userId, refreshToken) =>{
    await new Tokens({
        userId,
        refreshTokenId,
        token: refreshToken,
        createdAt: Date.now(),
        expiresAt: moment().add(7, 'days')
    }).save();
}