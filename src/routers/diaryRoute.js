import express from 'express';
import { auth } from '../middleware/AuthMiddleware';
import * as controller from '../controllers/diaries';
import { upload } from '../configs/uploadFileConfig';

const router = express.Router();

router.post('/', auth, upload.single('file'), controller.diary.newDiary);
router.get('/:username', auth, controller.diary.getListPerUser);
router.get('/:diaryId', auth, controller.diary.getOne);

export default router;
