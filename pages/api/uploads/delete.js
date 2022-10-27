import auth from '../../../middleware/auth';
import { CONTACT_ADMIN_ERR_MSG, ERROR_403 } from '../../../utils/constants';
import { cloud_delete } from './cloudinary';


/*
    DELETE    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "DELETE":
            await deleteImage(req, res)
            break;
    }
}

const deleteImage = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_403 })
        cloud_delete(req.body.publicIds);
        res.status(200).json({ message: 'Image(s) deleted successfully!' });
    } catch (err) {
        console.error('Error occurred while deleteImage: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }

}