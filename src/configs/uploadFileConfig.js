import multer from 'multer';
export const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5, // limit 5MB
  },
  fileFilter(_, file, cb) {
    console.log({
      type: file.originalname,
      match: !file.originalname.match(/\.(jpg|jpeg|png|webp|JPG|PNG)$/),
    });
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|JPG|PNG)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true); // call back function to check any error
  },
});
