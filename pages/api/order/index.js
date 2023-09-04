import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import Products from '../../../models/productModel'
import Notifications from '../../../models/notificationsModel'
import auth from '../../../middleware/auth'
import * as log from "../../../middleware/log"
import { handleServerError } from '../../../middleware/error'
import { CONTACT_ADMIN_ERR_MSG, NORMAL, ADMIN_ROLE, USER_ROLE, ORDER_DETAIL } from '../../../utils/constants'
import { notUserRole, formatDateTime } from '../../../utils/util'
import { updateStockAndSoldFromProd } from '../../../utils/productUtil'

connectDB()

/*
    POST     - Protected
    GET      - Protected
    PATCH    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            if (req.body.type === 'GET') await getOrders(req, res)
            else await createOrder(req, res)
            break;
        case "GET":
            await getOrders(req, res)
            break;
        case "PATCH":
            await updateOrderPlaced(req, res)
            break;
    }
}

const getOrders = async (req, res) => {
    try {
        const { role, id } = await auth(req, res)

        let orders;
        const { dateRange } = req.body;

        let filter = {};
        if (dateRange) filter = { ...filter, createdAt: { $gte: dateRange[0].startDate, $lt: dateRange[0].endDate } }

        if (role === USER_ROLE) {
            orders = await Orders.find({ user: id, ...filter }).populate({ path: "user", select: "name email -_id" }).sort({ createdAt: -1 })
        } else if (role === ADMIN_ROLE) {
            orders = await Orders.find({ ...filter, placed: true }).populate("user", "-password").sort({ createdAt: -1 })
        } else {
            return res.status(403).json({ err: ERROR_403 });
        }
        res.json({ orders })
    } catch (err) {
        log.error('Error occurred while getOrders: ', err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const createOrder = async (req, res) => {
    log.info('Creating Order ....');
    try {
        const result = await auth(req, res)
        const { address, cart, total } = req.body

        if (notUserRole(result.role)) return res.status(403).json({ err: ERROR_403 });

        const updatedCart = await updateStockAndSold(cart);
        const newOrder = await new Orders({ user: result.id, address, cart:updatedCart, total }).save();

        res.json({
            msg: 'Order created.',
            newOrder
        });

    } catch (err) {
        log.error('Error occurred while createOrder: ', err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const updateStockAndSold = async (cart, res) => {
    let prodIds = [];
    let prodsObj = {};
    let updatedCart = cart;
   try{
    cart.forEach(cartItem => prodIds.push(cartItem._id));

    const products = await Products.find({ _id: { $in: prodIds }});
    if (!products) throw 'No products found!';
    products.forEach((prod) => prodsObj[prod._id.toString()] = prod);
    updatedCart = await updateStockAndSoldFromProd(cart, prodsObj, res);
   } catch (err) { handleServerError('updateStockAndSold', err, 500, res) }
   return updatedCart;
}

const updateOrderPlaced = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (notUserRole(result.role)) return res.status(403).json({ err: ERROR_403 });

        const { id, method } = req.body
        const data = { placed: true, dateOfPlaced: formatDateTime(new Date()), method: method }
        await Orders.findOneAndUpdate({ _id: id }, data)
        notifyAdminForNewOrder(id, result.id);
        res.json({
            msg: 'Order placed successfully! You will be notified once the order is accepted.',
            result: {
                placed: true,
                dateOfPlaced: formatDateTime(new Date()),
                method: method
            }
        })
    } catch (err) { handleServerError('updateOrderPlaced', err, 500, res) }
}

const notifyAdminForNewOrder = (orderId, userId) => {
    try {
        new Notifications(
            {
                notification: `New order request! Order ID -${orderId}, Please acknowledge it immediately.`,
                type: NORMAL,
                action: { type: ORDER_DETAIL, data: { orderId } },
                user: userId,
                role: ADMIN_ROLE
            }
        ).save();
    } catch (err) {
        log.error('Error occurred while notifyAdminForNewOrder: ', err);
    }
}