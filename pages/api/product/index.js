import connectDB from '../../../utils/connectDB'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../utils/constants'

connectDB()

/*
    GET     - Public
    POST    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.query.type === 'GET_COUNT') {
                await getAllProductsCount(req, res)
            } else await getProducts(req, res)
            break;
        case "POST":
            await createProduct(req, res)
            break;
    }
}
const getAllProductsCount = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })
        const products = await Products.find();
        res.json({ count: products.length })
    } catch (err) {
        console.error('Error occurred while getAllProductsCount: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString }

        const excludeFields = ['page', 'sort', 'limit']
        excludeFields.forEach(el => delete (queryObj[el]))

        if (queryObj.category !== 'all')
            this.query.find({ category: queryObj.category })
        if (queryObj.title !== 'all')
            this.query.find({ title: { $regex: queryObj.title } })

        this.query.find()
        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 6
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const getProducts = async (req, res) => {
    try {
        const features = new APIfeatures(Products.find(), req.query)
            .filtering().sorting().paginating()

        const products = await features.query

        res.json({
            status: 'success',
            result: products.length,
            products
        })
    } catch (err) {
        console.error('Error occurred while getProducts: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const createProduct = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })

        const { title, mrpPrice, price, tax, totalPrice, inStock, description, content, category, images, number, discount } = req.body

        if (!title || !mrpPrice || !price || !inStock || !description || !tax || !totalPrice || !content || category === 'all' || images.length === 0)
            return res.status(400).json({ err: 'Please add all the fields.' })

        const product = await Products.findOne({ title: title.toLowerCase() });
        if (product) return res.status(400).json({ err: 'Product Name already exist, please choose different name.' })

        const newProduct = new Products({
            title: title.toLowerCase(), mrpPrice, price, tax, totalPrice, inStock, description, content, category, images, number, discount
        })
        await newProduct.save()

        res.json({ msg: 'New product added successfully.' })

    } catch (err) {
        console.error('Error occurred while createProduct: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}