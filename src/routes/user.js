import { Router } from 'express';
import * as userController from '../controllers/user.js';

const router = Router();
router.post('/', userController.createUser);
router.get('/', userController.getAllUser);
router.get('/:accNumber', userController.getUserByAccNumber);
router.delete('/:userId', userController.deleteUserByUserId);
router.patch('/:userId', userController.updateUserByUserId);
router.delete('/', userController.deleteAllUser);

export default router;