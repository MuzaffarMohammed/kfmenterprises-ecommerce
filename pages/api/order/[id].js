import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG } from '../../../utils/constants'

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
        const result = await auth(req, res)
        if (result.role !== 'admin') {
            const { id } = req.query
            const order = await Orders.findOne({ _id: id })
            res.json({ order })
        }
    } catch (err) {
        console.error('Error occurred while getOrder: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') {
            const { id } = req.query
            await Orders.findByIdAndDelete(id)
            res.json({msg: "Order deleted due to non-payment policy!"})
        }
    } catch (err) {
        console.error('Error occurred while deleteOrder: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}