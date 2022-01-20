import connectDB from '../../../../utils/connectDB'
import auth from '../../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG } from '../../../../utils/constants'
import Orders from '../../../../models/orderModel';
import crypto from 'crypto';
import { parseToIndiaTime } from '../../../../utils/util';

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await verifyPayment(req, res)
            break;
    }
}

const verifyPayment = async (req, res) => {
    let verified = false;
    try {
        const result = await auth(req, res);
        if (result.role !== 'admin') {
            const { orderId, payPaymentId, paySignature } = req.body;
            const order = await Orders.findOne({ _id: orderId });
            if (order) {
                console.log("paymentOrderId : ", order.paymentOrderId, "  orderId : ", orderId);
                var expectedSignature = crypto.createHmac('sha256', process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET)
                    .update(order.paymentOrderId + "|" + payPaymentId)
                    .digest('hex');
                verified = expectedSignature === paySignature;
                if (verified) {
                    const dateOfPayment = parseToIndiaTime(new Date());
                    await Orders.findOneAndUpdate({ _id: orderId }, { paid: true, dateOfPayment, method: 'Online' })
                }
            }
        }
        res.json({ verified });
    } catch (err) {
        console.error('Error occurred while verifyPayment: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}