import connectDB from '../../../utils/connectDB'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import { deleteData } from '../../../utils/fetchData'
import { ERROR_403 } from '../../../utils/constants'
import { handleServerError } from '../../../middleware/error'
import { displayProduct } from '../../../utils/productUtil'

connectDB()

/*
    GET     - Public
    PUT      - Partial Protected
    DELETE    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getProduct(req, res)
            break;
        case "PUT":
            await updateProduct(req, res)
            break;
        case "DELETE":
            await deleteProduct(req, res)
            break;
    }
}

const getProduct = async (req, res) => {
    try {
        const { id, count, dp } = req.query;
        const product = await Products.findById({_id: id})
        if (!product) return res.status(400).json({ err: 'This product does not exist.' })
        if (count) return res.json({ count: product.inStock })
        res.json({ product: (dp && dp === '1') ? displayProduct(product) : product })
    } catch (err) { handleServerError('getProduct', err, 500, res) }

}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.query
        const { title, mrpPrice, price, tax, totalPrice, inStock, description, content, categories, images, discount, updateStockAndSold, sold, attributesRequired } = req.body

        if (updateStockAndSold) {
            await Products.findOneAndUpdate({ _id: id }, { inStock, sold })
            return res.status(200).json({ msg: 'Product updateStockAndSold updated!' })
        } else {
            const result = await auth(req, res)
            if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })
            if (!title || !mrpPrice || !price || !inStock || !description || !tax || !totalPrice || !content || categories === 'all' || images.length === 0)
                return res.status(400).json({ err: 'Please add all the fields.' })

            await Products.findOneAndUpdate({ _id: id }, {
                title, mrpPrice, price, tax, totalPrice, inStock, description, content, categories, images, discount, attributesRequired
            })
            res.json({ msg: 'Product updated successfully!' })
        }
    } catch (err) { handleServerError('updateProduct', err, 500, res) }
}

const deleteProduct = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })
        const { id } = req.query;
        deleteImages(id, req.headers.authorization, res);
        await Products.findByIdAndDelete({_id:id})
        res.json({ msg: 'Product deleted successfully.' })
    } catch (err) { handleServerError('deleteProduct', err, 500, res) }
}

const deleteImages = async (id, token, res) => {
    console.log("Deleting Images ...")
    try {
        const product = await Products.findById(id);
        const publicIds = product.images.map(image => image.public_id);
        deleteData(`uploads/delete`, token, { publicIds });
    } catch (err) { handleServerError('deleteImages', err, 500, res) }
}