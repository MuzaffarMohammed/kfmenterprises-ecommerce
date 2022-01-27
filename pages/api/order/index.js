import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG } from '../../../utils/constants'
import { parseToIndiaTime } from '../../../utils/util'

connectDB()

/*
    POST     - Protected
    GET      - Protected
    PATCH    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await createOrder(req, res)
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
        const result = await auth(req, res)

        let orders;
        if (result.role !== 'admin') {
            orders = await Orders.find({ user: result.id }).populate("user", "-password").sort({ createdAt: -1 })
        } else {
            orders = await Orders.find().populate("user", "-password").sort({ createdAt: -1 })
        }

        res.json({ orders })
    } catch (err) {
        console.error('Error occurred while getOrders: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const createOrder = async (req, res) => {
    console.log('Creating Order ....')
    try {
        const result = await auth(req, res)
        const { address, mobile, cart, total } = req.body

        for (let i = 0; i < cart.length; i++) {
            await sold(cart, i);
        }

        const newOrder = new Orders({
            user: result.id, address, mobile, cart, total
        })

        await newOrder.save()

        res.json({
            msg: 'Order placed! You will be notified once order is accepted.',
            newOrder
        })

    } catch (err) {
        console.error('Error occurred while createOrder: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const sold = async (cart, index) => {

    let oldCartItem = cart[index];
    const updatedStock = oldCartItem.inStock - oldCartItem.quantity;
    const updatedSold = oldCartItem.quantity + oldCartItem.sold;
    oldCartItem.inStock = updatedStock;
    oldCartItem.sold = updatedSold;
    cart[index] = oldCartItem;
    //console.log('Updating in DB cart : ', cart, 'updatedStock', updatedStock, 'updatedSold : ', updatedSold);
    await Products.findOneAndUpdate({ _id: oldCartItem._id }, { inStock: updatedStock, sold: updatedSold })
}

const updateOrderPlaced = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role === 'user') {
            const { id, method } = req.body
            const data = { placed: true, dateOfPlaced: parseToIndiaTime(new Date()), method: method }
            await Orders.findOneAndUpdate({ _id: id }, data)

            res.json({
                msg: 'Order placed successfully!',
                result: {
                    placed: true,
                    dateOfPlaced: parseToIndiaTime(new Date()),
                    method: method
                }
            })
        }
    } catch (err) {
        console.error('Error occurred while updateOrderPlaced: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}