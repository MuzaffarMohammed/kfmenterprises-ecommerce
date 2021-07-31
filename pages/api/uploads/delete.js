import auth from '../../../middleware/auth';
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
        if (result.role !== 'admin') return res.status(400).json({ err: 'Unauthorized Access!' })

        console.log('req.body.publicIds : ', req.body.publicIds);

        const imageDelete = cloud_delete(req.body.publicIds);
        res.status(200).json({ message: 'Image(s) deleted successfully!' });

    } catch (err) {
        console.log('Error occurred while deleteImage: ' + err);
        return res.status(500).json({ err: err.message })
    }

}