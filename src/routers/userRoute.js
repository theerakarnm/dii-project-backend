import express from 'express';
import { auth } from '../middleware/AuthMiddleware';
import * as controller from '../controllers/userController';

const router = express.Router();

router.get('/:userId', auth, controller.getOne);
router.put('/:username', auth, controller.editProfile);
router.put('/password/reset', auth, controller.resetPassword);
router.get('/search/:context', auth, controller.search);

export default router;
