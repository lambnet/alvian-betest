import { Router } from 'express';
import * as accountController from '../controllers/account.js';

const router = Router();

router.post('/', accountController.createAccount);
router.get('/', accountController.getAllAccount);
router.get('/last-login/:days', accountController.getAllAccByLastLogin);
router.delete('/:accountId', accountController.deleteAccByAccId);
router.patch('/:accountId', accountController.updateAccPasswordByAccId);
router.delete('/', accountController.deleteAllAcc);

export default router;