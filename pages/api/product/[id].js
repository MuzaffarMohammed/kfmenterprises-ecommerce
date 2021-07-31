import connectDB from '../../../utils/connectDB'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import { deleteData } from '../../../utils/fetchData'

connectDB()

/*
    GET     - Protected
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
        const { id } = req.query;

        const product = await Products.findById(id)
        if (!product) return res.status(400).json({ err: 'This product does not exist.' })

        res.json({ product })

    } catch (err) {
        console.log('Error occurred while getProduct: ' + err);
        return res.status(500).json({ err: err.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.query
        const { title, price, tax, totalPrice, inStock, description, content, category, images, discount, updateStockAndSold, sold } = req.body

        if (updateStockAndSold) {
            await Products.findOneAndUpdate({ _id: id }, { inStock, sold })
            return res.status(200).json({ msg: 'Product updateStockAndSold updated!' })
        } else {
            const result = await auth(req, res)
            if (result.role !== 'admin') return res.status(400).json({ err: 'Unauthorized Access!' })
            if (!title || !price || !inStock || !description || !tax || !totalPrice || !content || category === 'all' || images.length === 0)
                return res.status(400).json({ err: 'Please add all the fields.' })

            await Products.findOneAndUpdate({ _id: id }, {
                title, price, tax, totalPrice, inStock, description, content, category, images, discount
            })
            res.json({ msg: 'Product updated successfully!' })
        }
    } catch (err) {
        console.log('Error occurred while updateProduct: ' + err);
        return res.status(500).json({ err: err.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const result = await auth(req, res)

        if (result.role !== 'admin') return res.status(400).json({ err: 'Unauthorized Access!' })

        const { id } = req.query;

        deleteImages(id, req.headers.authorization, res);

        await Products.findByIdAndDelete(id)
        res.json({ msg: 'Product deleted successfully.' })

    } catch (err) {
        console.log('Error occurred while deleteProduct: ' + err);
        return res.status(500).json({ err: err.message })
    }
}

const deleteImages = async (id, token, res) => {
    console.log("Deleting Images ...")
    try {
        const product = await Products.findById(id);
        const publicIds = product.images.map(image => image.public_id);
        console.log('Public Ids : ', publicIds);
        deleteData(`uploads/delete`, token, { publicIds });
    } catch (err) {
        console.log('Error occurred while deleteImages: ' + err);
        return res.status(500).json({ err: err.message })
    }
}