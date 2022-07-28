import connectDB from "../../../utils/connectDB";
import { AUTO_CANCEL_ORDER_JOB, ERROR_403 } from "../../../utils/constants";
import { notAdminNotUserRole } from "../../../utils/util";
import { autoCancelOrder } from "./auto_cancel_order_job";
import auth from '../../../middleware/auth'
import * as log from "../../../middleware/log"

connectDB()

/*
    POST     - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await publishJob(req, res)
            break;
    }
}

const publishJob = async (req, res) => {
    const { role } = await auth(req, res);
    if (notAdminNotUserRole(role)) return res.status(403).json({ err: ERROR_403 });
    const { order, jobName } = req.body;
    const token = req.headers.authorization;
    switch (jobName) {
        case AUTO_CANCEL_ORDER_JOB:
            await autoCancelOrder(order, token);
            break;
        default:
            break;
    }
    log.debug('Job initiated successfully!');
    res.json({ msg: 'Job initiated successfully!' });
}
