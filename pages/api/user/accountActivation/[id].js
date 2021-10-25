import connectDB from '../../../../utils/connectDB'
import Users from '../../../../models/userModel'
import { CONTACT_ADMIN_ERR_MSG } from '../../../../utils/constants'

connectDB()

/*
    GET    - Unprotected
*/

export default async (req, res) => {
    switch(req.method){
        case "GET":
            await accountActivation(req, res)
            break;
    }
}

const accountActivation = async (req, res) => {
    try {
        const {id} = req.query
        console.log('ID came in activation link!')
        await Users.findOneAndUpdate({_id:  id}, {activated: true})

        res.send(` <!DOCTYPE html />
                    <html>
                    <body>
                     <h3>Congratulations, account activated successfully!</h3>
                     <a href=${process.env.NEXT_PUBLIC_BASE_URL}>Continue Shopping</a>
                    </body>
                    </html>
                 `)
        
    } catch (err) {
        console.error('Error occurred while accountActivation: '+err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }   
}