import connectDB from "../../../utils/connectDB";
import Notifications from '../../../models/notificationsModel'
import auth from '../../../middleware/auth'
import { handleServerError } from '../../../middleware/error'
import { ERROR_403 } from "../../../utils/constants";
import { isAdminRole, notAdminNotUserRole } from "../../../utils/util";

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
    } catch (err) { handleServerError('postNotifications', err, 500, res) }

}

const getAllNotifications = async (req, res) => {
    try {
        const { id, role } = await auth(req, res);
        if (notAdminNotUserRole(role)) return res.status(403).json({ err: ERROR_403 });
        let filter = { user: id, role: role, checked: false }
        if (isAdminRole(role)) filter = { role: role, checked: false }
        const notifications = await Notifications.find(filter).sort({ createdAt: -1 });
        res.json({ notifications })
    } catch (err) { res.json({})/*handleServerError('getAllNotifications', err, 500, res) */ }
}