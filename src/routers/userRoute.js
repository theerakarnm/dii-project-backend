import express from 'express';
import { auth } from '../middleware/AuthMiddleware';
import * as controller from '../controllers/userController';

const router = express.Router();

router.get('/:userId', controller.getOne);
router.put('/:username', controller.updateOne);

export default router;
