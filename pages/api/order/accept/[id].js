import connectDB from '../../../../utils/connectDB'
import Orders from '../../../../models/orderModel'
import auth from '../../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_403, NORMAL, ORDER_DETAIL, USER_ROLE } from '../../../../utils/constants'
import { formatDateTime, notAdminRole } from '../../../../utils/util'
import Notifications from '../../../../models/notificationsModel'
import * as log from "../../../../middleware/log"

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
    log.debug("Inside acceptOrder....")
    try {
        const {role} = await auth(req, res)
        log.debug("Role : "+role)
        if (notAdminRole(role)) return res.status(403).json({ err: ERROR_403 });

        const { id } = req.query
        const dateOfAccept = formatDateTime(new Date());
        const order = await Orders.findOne({ _id: id}).populate({ path: "user", select: "_id" })
        if(order && order.user._id){
            await Orders.findOneAndUpdate({ _id: id }, { accepted: true, dateOfAccept });
            notifyUserForConfirmedOrder(id, order.user._id);
            res.json({
                msg: 'Order Accepted!',
                result: {
                    accepted: true,
                    dateOfAccept: dateOfAccept
                }
            })
            log.debug("Order Accepted!")
        }else{
            log.error("acceptOrder", "Order or order's user doesn't exist!");
            return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG });
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