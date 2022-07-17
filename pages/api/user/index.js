import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import auth from '../../../middleware/auth'
import { ADDRESS_DEL, ADDRESS_EDIT, ADDRESS_NEW, CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../utils/constants'

connectDB()

/*
    PATCH    - Protected
    GET    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await uploadInfor(req, res)
            break;
        case "GET":
            await getUsers(req, res)
            break;
    }
}

const getUsers = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin')
            return res.status(401).json({ err: ERROR_403 })

        const users = await Users.find({ activated: true });
        res.json({ users })

    } catch (err) {
        console.error('Error occurred while getUsers: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}


const uploadInfor = async (req, res) => {
    try {
        const result = await auth(req, res)
        const updateData = req.body
        if (updateData && updateData.dataType) {
            switch (updateData.dataType) {
                case ADDRESS_NEW:
                    const saved = await addNewAddress(updateData.address, result.id, res);
                    if (saved === 'SAVED') res.json({ msg: 'Address added successfully!' });
                    break;
                case ADDRESS_DEL:
                    await updateAddress(updateData.address, result.id, updateData.dataType, res);
                    break;
                case ADDRESS_EDIT:
                    await updateAddress(updateData.address, result.id, updateData.dataType, res);
                    break;
                default:
                    const newUser = await Users.findOneAndUpdate({ _id: result.id }, updateData);
                    res.json({
                        msg: "Update Success!",
                        user: {
                            name,
                            avatar,
                            email: newUser.email,
                            role: newUser.role,
                            activated: newUser.activated
                        }
                    })
            }
        } else res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    } catch (err) {
        console.error('Error occurred while uploadInfor: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const addNewAddress = async (address, id, res) => {
    try {
        if (address) {
            if (address.default) await Users.updateMany({ _id: id }, { $unset: { 'addresses.$[].default': 1 } });// deleting all default values from existing address and making only one default.
            await Users.findOneAndUpdate({ _id: id }, { $push: { addresses: address } });
            return "SAVED";
        }
    } catch (err) {
        console.error('Error occurred while addNewAddress: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const updateAddress = async (address, id, type, res) => {
    try {
        if (address && address.fullName) {
            // Deleting address from addresses array by fullName
            await Users.findOneAndUpdate({ _id: id }, { $pull: { addresses: { fullName: type === ADDRESS_DEL ? address.fullName : address.oldFullName } } });
            if (type === ADDRESS_EDIT) {// Re-inserting updated address
                if (address.default) await Users.updateMany({ _id: id }, { $unset: { 'addresses.$[].default': 1 } });// deleting all default values from existing address and making only one default.
                const saved = await addNewAddress(address, id, res);
                if (saved === 'SAVED') return res.json({ msg: 'Address edited successfully!' });
            } else if (type === ADDRESS_DEL) return res.json({ msg: 'Address deleted successfully!' });
        }
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    } catch (err) {
        console.error('Error occurred while updateAddress: ' + type + ' - ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}