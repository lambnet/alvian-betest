import { Router } from 'express';
import * as userController from '../controllers/user.js';
import { cacheData } from '../middlewares/cache.js';

const router = Router();
router.post('/', userController.createUser);
router.get('/', cacheData, userController.getAllUser);
router.get('/account-number/:accNumber', userController.getUserByAccNumber);
router.get('/registration-number/:regNumber', userController.getUserByRegNumber);
router.delete('/:userId', userController.deleteUserByUserId);
router.patch('/:userId', userController.updateUserByUserId);
router.delete('/', userController.deleteAllUser);

export default router;