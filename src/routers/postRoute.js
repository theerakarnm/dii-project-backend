import express from 'express';
import { auth } from '../middleware/AuthMiddleware';
import * as controller from '../controllers/posts';
import multer from 'multer';

const router = express.Router();

const upload = multer({
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

router.get('/', auth, controller.post.getRecent);
router.get('/popular', auth, controller.post.getPopular);
router.get('/recent', auth, controller.post.getRecent);
router.post('/', auth, upload.single('file'), controller.post.newPost);
router.put('/:postId', auth, controller.post.updatePost);
router.delete('/:postId', auth, controller.post.deletePost);

router.put('/like', auth, controller.like.updateLike);

router.post('/comment/add', auth, controller.comment.newComment);
router.post('/comment/get/:postId', auth, controller.comment.getCommentPerPost);

export default router;
