import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900,// this is the expiry time in seconds : 15 mins
    },
});

let Dataset = mongoose.models.token || mongoose.model('token', tokenSchema)
export default Dataset