import path from 'path';
import multer from 'multer';

const oneMegabyteInBytes = 1000000;


export const upload = multer({
    limits: { fileSize: oneMegabyteInBytes * 2 },
    storage: multer.diskStorage({
      destination: './public/assets/images/product',
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