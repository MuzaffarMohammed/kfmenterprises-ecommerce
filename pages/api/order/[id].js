import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import auth from '../../../middleware/auth'
import { ERROR_403 } from '../../../utils/constants'
import { notAdminNotUserRole } from '../../../utils/util'
import { handleServerError } from '../../../middleware/error'

connectDB()

/*
    GET     - Protected
    DELETE  - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getOrder(req, res)
            break;
        case "DELETE":
            await deleteOrder(req, res)
            break;
    }
}

const getOrder = async (req, res) => {
    try {
        const { role } = await auth(req, res);
        if (notAdminNotUserRole(role)) return res.status(403).json({ err: ERROR_403 });
        const { id } = req.query
        const order = await Orders.findOne({ _id: id }).populate({ path: "user", select: "name email -_id" })
        res.json({ order })
    } catch (err) { return handleServerError('getOrder', err, 500, res) }

}

const deleteOrder = async (req, res) => {
    try {
        const { role } = await auth(req, res);
        if (notAdminNotUserRole(role)) return res.status(403).json({ err: ERROR_403 });
        const { id } = req.query;
        const order = await Orders.findOne({ _id: id, placed: false });
        await Orders.deleteOne({ _id: id, placed: false });
        res.json({ order });
    } catch (err) { return handleServerError('deleteOrder', err, 500, res) }
}