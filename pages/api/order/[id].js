import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import auth from '../../../middleware/auth'

connectDB()

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
        console.log('Error occurred while getOrder: ' + err);
        return res.status(500).json({ err: err.message })
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
        console.log('Error occurred while deleteOrder: ' + err);
        return res.status(500).json({ err: err.message })
    }
}