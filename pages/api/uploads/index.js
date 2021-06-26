import nextConnect from 'next-connect';
import {cloud_uploads} from './cloudinary';
import { upload } from "./multer";

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.log('Error occurred while image upload: '+err);
    res.status(501).json({ error: `Image upload Error: ${error}`});
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array('file'), async (req, res) => {

   const uploader = async (path) => await cloud_uploads(path, 'Images');
   if (req.method === 'POST') {
     const files = req.files;
     var urls = [];
     for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push({url:newPath})
          }

      res.status(200).json({
              message: 'images uploaded successfully',
              data: urls
            })

  } else {
        res.status(405).json({
          err: `${req.method} method not allowed`
        })
      }
});

apiRoute.post((req, res) => {

  res.status(200).json({ data: 'success' });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute;