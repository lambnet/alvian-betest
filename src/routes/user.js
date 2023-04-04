import { Router } from 'express';
import * as userController from '../controllers/user.js';

const router = Router();
router.post('/', userController.createUser);
router.get('/', userController.getAllUser);
router.get('/:accNumber', userController.getUserByAccNumber);


export default router;