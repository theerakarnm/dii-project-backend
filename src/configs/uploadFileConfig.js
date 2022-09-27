import multer from 'multer';
export const upload = multer({
  // storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // limit 5MB
  },
  fileFilter(_, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }

    cb(undefined, true);
  },
});
