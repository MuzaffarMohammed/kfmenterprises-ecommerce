import connectDB from "../../../utils/connectDB";
import Notifications from '../../../models/notificationsModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_403 } from "../../../utils/constants";
import { notAdminNotUserRole } from "../../../utils/util";

connectDB()

/*
    POST     - Protected
    GET      - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await postNotifications(req, res)
            break;
        case "GET":
            await getAllNotifications(req, res)
            break;
    }
}
const postNotifications = async (req, res) => {
    try {
        const { role } = await auth(req, res)
        if (notAdminNotUserRole(role)) return res.status(403).json({ err: ERROR_403 });
        const { _id, checked } = req.body
        await Notifications.findOneAndUpdate({ _id }, { checked })
        res.json({ msg: "Notification acknowledged successfully." })
    } catch (err) {
        console.error('Error occurred while postNotifications: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const getAllNotifications = async (req, res) => {
    try {
        const { role } = await auth(req, res);
        if (notAdminNotUserRole(role)) return res.status(403).json({ err: ERROR_403 });
        console.log('role', role)
        const notifications = await Notifications.find({ role: role, checked: false }).sort({ createdAt: -1 });
        res.json({ notifications })
    } catch (err) {
        console.error('Error occurred while getAllNotifications: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}