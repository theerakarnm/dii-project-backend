import express from 'express';
import { auth } from '../middleware/AuthMiddleware';
import * as controller from '../controllers/userController';

const router = express.Router();

router.get('/:userId', auth, controller.getOne);
router.put('/:username', auth, controller.updateOne);
router.get('/search', auth, controller.search);

export default router;
