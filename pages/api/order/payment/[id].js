import connectDB from '../../../../utils/connectDB'
import auth from '../../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG } from '../../../../utils/constants'
import { saveAndGenerateRazorPayOrder } from './razorpay'
import Orders from '../../../../models/orderModel';

connectDB()

/*
    PATCH     - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await orderPayment(req, res)
            break;
    }
}

const orderPayment = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role === 'user') {
            const { id: orderId } = req.query
            const rPayOrderId = await saveAndGenerateRazorPayOrder(res, orderId);
            res.json({ msg: 'Payment success!', rPayOrderId })
        } else throw "Payment Order generation problem";
    } catch (err) {
        console.error('Error occurred while paymentOrder: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

