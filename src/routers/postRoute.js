import express from 'express';
import { auth } from '../middleware/AuthMiddleware';
import * as controller from '../controllers/posts';
import { upload } from '../configs/uploadFileConfig';

const router = express.Router();

router.get('/', auth, controller.post.getRecent);
router.get('/individual/:postId', auth, controller.post.getById);
router.get('/recent', auth, controller.post.getRecent);
router.post('/', auth, upload.single('file'), controller.post.newPost);
router.put('/:postId', auth, controller.post.updatePost);
router.delete('/:postId', auth, controller.post.deletePost);

router.put('/like/:postId', auth, controller.like.updateLike);

router.post('/comments/add', auth, controller.comment.newComment);
router.get('/comments/:postId', auth, controller.comment.getCommentPerPost);

export default router;
