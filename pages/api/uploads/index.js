import {createRouter} from 'next-connect';
import auth from '../../../middleware/auth';
import { cloud_uploads } from './cloudinary';
import { upload } from "./multer";

/*
    DELETE    - Unprotected
*/

const apiRoute = createRouter();

// const apiRoute = nextConnect({
//   onError(error, req, res) {
//     console.error('Error occurred while image upload: ' + error);
//     res.status(501).json({ error: `Image upload Error: ${error}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

apiRoute.use(upload.array('file'), async (req, res) => {
  switch (req.method) {
    case 'POST': uploadImage(req, res);
      break;
    default:
      res.status(405).json({ err: `${req.method} method not allowed` })
  }
});

const uploadImage = async (req, res) => {
  try {
    const files = req.files;
    var urls = [];
    const uploader = async (imageFile) => await cloud_uploads(imageFile, req.query.to);
    for (const file of files) {
      console.log('Uploading image : ', file.originalname);
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;
      const newPath = await uploader(dataURI);
      urls.push({ url: newPath })
    }
    res.status(200).json({
      message: 'images uploaded successfully',
      data: urls
    })
  } catch (err) {
    console.error('Error occured while uploadImage : ', err);
    res.status(500).json({ error: `Image upload failed!` });
  }
}

apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute.handler();