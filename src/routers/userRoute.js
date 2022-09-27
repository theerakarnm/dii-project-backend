import express from 'express';
import { auth } from '../middleware/AuthMiddleware';
import * as controller from '../controllers/userController';

const router = express.Router();

router.get('/:userId', controller.getOne);

export default router;
