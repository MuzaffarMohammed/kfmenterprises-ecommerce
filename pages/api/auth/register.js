import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import valid from '../../../utils/valid'
import {postData} from '../../../utils/fetchData'
import bcrypt from 'bcrypt'


connectDB()

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await register(req, res)
            break;
    }
}

const register = async (req, res) => {
    try{
        const { name, email, password, cf_password } = req.body

        const errMsg = valid(name, email, password, cf_password)
        if(errMsg) return res.status(400).json({err: errMsg})

        const user = await Users.findOne({ email })
        if(user) return res.status(400).json({err: 'This email already exists.'})

        const passwordHash = await bcrypt.hash(password, 12)

        const newUser = new Users({ 
            name, email, password: passwordHash, cf_password, activated: false
        })
        const addedUser = await newUser.save()
        const {_id: id, name:userName} = addedUser;
        postData('mail', {id, userName, email})
        res.json({msg: "Registration Successful, an email has been sent to your mail address, please activate your account to continue shopping."})

    }catch(err){
        return res.status(500).json({err: err.message})
    }
}