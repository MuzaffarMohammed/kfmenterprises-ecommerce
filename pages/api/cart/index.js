import connectDB from '../../../utils/connectDB'
import Categories from '../../../models/categoryModel'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../utils/constants'

connectDB()

/*
    
    POST    - Public
*/

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            break;
        case "POST":
            if (req.query.type === 'GC') {
                await getCart(req, res)
            }
            break;
    }
}


const getCart = async (req, res) => {
    try {
        const selectedCart = req.body;

        const prodIds = selectedCart.map(item => item._id)
        console.log('prodIds : ', prodIds)
        const products = await Products.find({_id:prodIds});
        let cart = [];
        selectedCart.forEach(item => {
            products.forEach(prod =>{
                const prodId = prod._id.valueOf();
                if(prodId === item._id){

                    


                    cart.push({
                        _id:prodId,
                        quantity: item.quantity > inStock ? inStock : item.quantity
                    })
                }
            })
        });

        console.log('products : ',products)
        res.json({
            status: 'success'
        })
    } catch (err) {
        console.error('Error occurred while getCart: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}