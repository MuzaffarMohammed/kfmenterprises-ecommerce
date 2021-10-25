import jwt from 'jsonwebtoken'
import Users from '../models/userModel'


const auth = async (req, res) => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).json({err: 'Invalid Authentication!'})
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET)
    if(!decoded) return res.status(401).json({err: 'Invalid Authentication!'})

    //checkIsBlacklistedToken(decoded.refreshTokenId, res);

    const user = await Users.findOne({_id: decoded.id})

    return {id: user._id, role: user.role, root: user.root};
}

// const checkIsBlacklistedToken = async (refreshTokenId, res) => {
//     const token = await Tokens.findOne({ refreshTokenId, isBlackListed: true});
//     if (token) {
//         console.error('WARNING: Blacklisted user accessing the system, refreshTokenId: ', refreshTokenId);
//         return res.status(401).json({ err: `You are not authorized to access the application now, ${CONTACT_ADMIN_ERR_MSG}` })
//     }
// }

export default auth