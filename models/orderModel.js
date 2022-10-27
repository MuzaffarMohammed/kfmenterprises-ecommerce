import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    address: Object,
    cart: Array,
    total: Number,
    paymentId: String,
    paymentOrderId:String,
    method: String,
    delivered: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    placed:{
        type: Boolean,
        default: false
    },
    accepted:{
        type: Boolean,
        default: false
    },
    dateOfPayment: Date,
    dateOfPlaced: Date,
    dateOfAccept: Date,
}, {
    timestamps: true
})

let Dataset = mongoose.models.order || mongoose.model('order', orderSchema)
export default Dataset