import connectDB from '../../../../utils/connectDB'
import Products from '../../../../models/productModel'
import auth from '../../../../middleware/auth'
import { ERROR_403 } from '../../../../utils/constants'
import { handleServerError } from '../../../../middleware/error'
import { isEmpty } from 'lodash'

connectDB()

/*
    GET     - Public
    PUT      - Partial Protected
    DELETE    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getProductAttributes(req, res)
            break;
        case "PUT":
            await updateProductAtrributes(req, res)
            break;
        case "DELETE":
            await deleteProduct(req, res)
            break;
    }
}

// const getProduct = async (req, res) => {
//     try {
//         const { id, count } = req.query;
//         const product = await Products.findById(id)
//         if (!product) return res.status(400).json({ err: 'This product does not exist.' })
//         if (count) return res.json({ count: product.inStock })
//         res.json({ product })
//     } catch (err) { handleServerError('getProduct', err, 500, res) }
// }

const updateProductAtrributes = async (req, res) => {
    try {
        const { id } = req.query
        const { attributes, updateStockAndSold, sold } = req.body

        if (updateStockAndSold) {
            // await Products.findOneAndUpdate({ _id: id }, { inStock, sold })
            // return res.status(200).json({ msg: 'Product updateStockAndSold updated!' })
        } else {
            const result = await auth(req, res)
            if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 });

            if (!isEmpty(attributes)) {
                await Products.findOneAndUpdate({ _id: id }, { attributes });
                return res.json({ msg: 'Product attributes updated successfully!' })
            }
        }
        return res.json({ msg: 'No change made!' })
    } catch (err) { handleServerError('updateProductAtrributes', err, 500, res) }
}