import connectDB from '../../../../utils/connectDB'
import Orders from '../../../../models/orderModel'
import auth from '../../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, NORMAL, ORDER_DETAIL, USER_ROLE } from '../../../../utils/constants'
import { formatDateTime } from '../../../../utils/util'
import Notifications from '../../../../models/notificationsModel'

connectDB()

/*
    PATCH     - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await acceptOrder(req, res)
            break;
    }
}

const acceptOrder = async (req, res) => {
    try {
        const result = await auth(req, res)

        if (result.role === 'admin') {
            const { id } = req.query
            const dateOfAccept = formatDateTime(new Date());
            await Orders.findOneAndUpdate({ _id: id }, { accepted: true, dateOfAccept });
            notifyUserForConfirmedOrder(id, result.id);
            res.json({
                msg: 'Order Accepted!',
                result: {
                    accepted: true,
                    dateOfAccept: dateOfAccept
                }
            })
        }

    } catch (err) {
        console.error('Error occurred while acceptOrder: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const notifyUserForConfirmedOrder = (orderId, userId) => {
    try {
        new Notifications(
            {
                notification: `You order-[${orderId}] is confirmed by seller. Thank you for your patience, it will dispatch soon.`,
                type: NORMAL,
                action: { type: ORDER_DETAIL, data: { orderId } },
                user: userId,
                role: USER_ROLE
            }
        ).save();
    } catch (err) {
        console.error('Error occurred while notifyUserForConfirmedOrder: ' + err);
    }
}