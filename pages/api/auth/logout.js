import connectDB from '../../../utils/connectDB'
import Tokens from '../../../models/tokenModel'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../utils/constants'

connectDB()

/*
    POST - protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "PUT":
            await logout(req, res)
            break;
    }
}

const logout = async (req, res) => {
    try {
        //await auth(req, res); // removed because session timeout issue occur.
        const refreshTokenId = await blacklistRefreshToken(req.cookies.refreshtoken, res);
        if (refreshTokenId) await Tokens.updateMany({ refreshTokenId }, { $set: { isBlackListed: true } });
        res.status(200).json({ msg: 'Logged out successfully!' });
    } catch (err) {
        console.error('Error occurred while logout: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const blacklistRefreshToken = async (refreshToken, res) => {
    try {
        if (!refreshToken) return res.status(401).json({ err: ERROR_403 })
        const result = jwt.verify(refreshToken, process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
        return result.refreshTokenId;
    } catch (err) {
        console.error('Error occurred while blacklistRefreshToken: ' + err);
        if (err instanceof TokenExpiredError) return;
        return res.status(401).json({ err: ERROR_403 });
    }
}