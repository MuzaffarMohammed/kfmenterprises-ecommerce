import nextConnect from 'next-connect';
import path from 'path';
import multer from 'multer';
import {cloud_uploads} from './cloudinary';

const oneMegabyteInBytes = 1000000;

const upload = multer({
  limits: { fileSize: oneMegabyteInBytes * 2 },
  storage: multer.diskStorage({
    destination: './public/assets/images',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
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