import connectDB from '../../../../utils/connectDB'
import Orders from '../../../../models/orderModel'
import auth from '../../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG } from '../../../../utils/constants'

connectDB()

/*
    PATCH     - Protected
*/

export default async (req, res) => {
    switch(req.method){
        case "PATCH":
            await acceptOrder(req, res)
            break;
    }
}

const acceptOrder = async(req, res) => {
    try {
        const result = await auth(req, res)
        
        if(result.role === 'admin'){
            const {id} = req.query
            const dateOfAccept = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            await Orders.findOneAndUpdate({_id: id}, {accepted: true, dateOfAccept})
    
            res.json({
                msg: 'Order Accepted!',
                result:{
                    accepted: true,
                    dateOfAccept: dateOfAccept
                }
            })
        }
        
    } catch (err) {
        console.error('Error occurred while acceptOrder: '+err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}