import connectDB from '../../../../utils/connectDB'
import auth from '../../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG } from '../../../../utils/constants'
import Orders from '../../../../models/orderModel';
import crypto from 'crypto';
import { formatDateTime } from '../../../../utils/util';
import { getPayOrderStatus, getPayPaymentStatus } from './razorpay';

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await verifyPayment(req, res)
            break;
    }
}

const verifyPayment = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== 'admin') {
            const { orderId, payPaymentId, paySignature } = req.body;
            const order = await Orders.findOne({ _id: orderId });
            if (order) {
                var expectedSignature = crypto.createHmac('sha256', process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET)
                    .update(order.paymentOrderId + "|" + payPaymentId)
                    .digest('hex');
                const verified = expectedSignature === paySignature;
                if (verified) {
                    const dateOfPayment = formatDateTime(new Date());
                    const payOrderStatus = await getPayOrderStatus(order.paymentOrderId);
                    const pay = await getPayPaymentStatus(payPaymentId);
                    if (payOrderStatus === 'paid' && pay.payPaymentStatus === 'captured') {
                        await Orders.findOneAndUpdate({ _id: orderId }, { paid: true, dateOfPayment, method: pay.payPaymentType })
                        return res.json({ verified: true, method: pay.payPaymentType });
                    } else res.status(500).json({ err: 'Payment failure! Please try again.' })
                }
            }
        }
        res.json({ verified : false });
    } catch (err) {
        console.error('Error occurred while verifyPayment: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}