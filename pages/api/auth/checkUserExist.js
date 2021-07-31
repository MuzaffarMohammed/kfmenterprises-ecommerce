import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'

connectDB()
/*
    POST - Public
*/

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await checkUserExist(req, res)
            break;   
    }
}


const checkUserExist = async (req, res) => {
    try{
        const { accountRecoveryEmail: email} = req.body
        let user = await Users.findOne({ email })
        if(!user) return res.status(400).json({err: 'This user does not exist.'})
        console.log("User Exists: ", email);
        res.json({
            msg: "Verified User",
            user: {
                id: user._id,
                name: user.name,
                activated: user.activated
            }
        })

    }catch(err){
        console.log('Error occurred while user check: '+err);
        return res.status(500).json({err: err.message})
    }

}