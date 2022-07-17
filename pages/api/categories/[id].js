import connectDB from '../../../utils/connectDB'
import Categories from '../../../models/categoriesModel'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../utils/constants'

connectDB()
/*
    PUT     - protected
    DELETE  - protected
*/
export default async (req, res) => {
    switch (req.method) {
        case "PUT":
            await updateCategory(req, res)
            break;
        case "DELETE":
            await deleteCategory(req, res)
            break;
    }
}

const updateCategory = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })

        const { id } = req.query
        const { name } = req.body

        const newCategory = await Categories.findOneAndUpdate({ _id: id }, { name })
        res.json({
            msg: "Success! Update a new category",
            category: {
                ...newCategory._doc,
                name
            }
        })
    } catch (err) {
        console.error('Error occurred while updateCategory: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })


        const { id } = req.query

        const products = await Products.findOne({ category: id })
        if (products) return res.status(400).json({
            err: "Please delete all products with a relationship"
        })

        await Categories.findByIdAndDelete(id)

        res.json({ msg: "Success! Deleted a category" })
    } catch (err) {
        console.error('Error occurred while deleteCategory: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}