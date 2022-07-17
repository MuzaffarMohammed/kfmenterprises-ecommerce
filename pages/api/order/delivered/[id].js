import connectDB from '../../../../utils/connectDB'
import Orders from '../../../../models/orderModel'
import auth from '../../../../middleware/auth'
import { COD, CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../../utils/constants'
import { formatDateTime } from '../../../../utils/util'

connectDB()

/*
    PATCH     - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await deliveredOrder(req, res)
            break;
    }
}

const deliveredOrder = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })

        const { id } = req.query


        const order = await Orders.findOne({ _id: id })
        if (order.paid) {
            await Orders.findOneAndUpdate({ _id: id }, { delivered: true })

            res.json({
                msg: 'Updated success!',
                result: {
                    paid: true,
                    dateOfPayment: order.dateOfPayment,
                    method: order.method,
                    delivered: true
                }
            })
        } else {
            await Orders.findOneAndUpdate({ _id: id }, {
                paid: true, dateOfPayment: new Date(),
                method: COD, delivered: true
            })

            res.json({
                msg: 'Updated success!',
                result: {
                    paid: true,
                    dateOfPayment: new Date(),
                    method: COD,
                    delivered: true
                }
            })
        }

    } catch (err) {
        console.error('Error occurred while deliveredOrder: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}