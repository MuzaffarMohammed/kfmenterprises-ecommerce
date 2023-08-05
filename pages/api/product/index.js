import connectDB from '../../../utils/connectDB'
import Categories from '../../../models/categoryModel'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../utils/constants'
import { calculateDiscountedPercentage } from '../../../utils/util'

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
            if (req.query.type === 'CP') {
                await createProduct(req, res)
            }
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


const getProducts = async (req, res) => {
    try {
        const { category, page, limit, sort, title } = req.query;

        let params = {}
        if (category && category !== 'all') params = { ...params, categories: category }
        if (title && title !== 'all') params = { ...params, title: { $regex: title } }
        const products = await Products.find(params).populate({ path: "categories", select: "name _id", model: Categories })
            .sort(sort ? sort : '-createdAt').skip((page ? (page - 1) : 0) * limit).limit(limit);
        res.json({
            status: 'success',
            count: products.length,
            products: displayProducts(products)
        })
    } catch (err) {
        console.error('Error occurred while getProducts: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const displayProducts = products => {

    let displayProducts = [];
    let disProduct = {};
    products.forEach(product => {
        disProduct = { _id: product._id, checked: product.checked }
        product.attributes && product.attributes.forEach(attr => {
            disProduct = { ...disProduct, url: attr.defaultImg.url, title: attr.title }
            let displayProductFound = false;
            attr.sizes && attr.sizes.forEach(size => {
                if (size.isDisplay) {
                    disProduct = populateProductPrices(disProduct, size);
                    console.log('disProduct 1: ',disProduct)
                    displayProductFound = true;
                }
            });
            if (!displayProductFound) disProduct = populateProductPrices(disProduct, attr.sizes[0]);
        });
        console.log('disProduct 2: ',disProduct)

        displayProducts.push(disProduct);
    });
    return displayProducts;
}

const populateProductPrices = (disProduct, size) => {
    return {
        ...disProduct,
        totalPrice: size.totalPrice,
        mrpPrice: size.mrpPrice,
        inStock: size.inStock,
        discount: calculateDiscountedPercentage(size.mrpPrice, size.totalPrice)
    }
}

const createProduct = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })

        const { title, mrpPrice, price, tax, totalPrice, inStock, description, content, categories, images, discount } = req.body

        if (!title || !mrpPrice || !price || !inStock || !description || !tax || !totalPrice || !content || categories === 'all' || images.length === 0)
            return res.status(400).json({ err: 'Please add all the fields.' })

        const product = await Products.findOne({ title: title.toLowerCase() });
        if (product) return res.status(400).json({ err: 'Product Name already exist, please choose different name.' })

        const newProduct = new Products({
            title: title.toLowerCase(), mrpPrice, price, tax, totalPrice, inStock, description, content, categories, images, discount
        })
        const productCreated = await newProduct.save()
        res.json({ msg: 'New product added successfully.', productId: productCreated._id })
    } catch (err) {
        console.error('Error occurred while createProduct: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}