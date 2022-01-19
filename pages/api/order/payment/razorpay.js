
import Razorpay from 'razorpay';
import connectDB from '../../../../utils/connectDB'
import Orders from '../../../../models/orderModel';
import { convertINRPaise } from '../../../../utils/util';

connectDB()

var rPay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET
});

export const saveAndGenerateRazorPayOrder = async (orderId) => {
    try {
        console.log('Initiating payment!!', orderId)
        if (orderId) {
            const order = await Orders.findOne({ _id: orderId });
            console.log("Order is: ", order.total);

            let totalAmount = order.total;
            if (process.env.NEXT_PUBLIC_RAZORPAY_CURRENCY === 'INR') totalAmount = convertINRPaise(totalAmount);// This is because in razorpa INR caculates from paise, where 1 rupee = 100 paise.

            var options = {
                amount: totalAmount,  // amount in the smallest currency unit
                currency: process.env.NEXT_PUBLIC_RAZORPAY_CURRENCY,
                receipt: orderId
            };
            const rPayOrder = await rPay.orders.create(options).catch(err => { throw err });

            // Updating our orders table with payment order id.
            await Orders.findOneAndUpdate({ _id: orderId }, {
                paymentOrderId: rPayOrder.id,
                method: 'online'
            });
            return rPayOrder.id;
        }
    } catch (err) {
        console.error('Error occurred while razorpay payment order: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}