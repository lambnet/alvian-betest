import { Router } from 'express';
import loginRouter from '../routes/login.js';
import userRouter from '../routes/user.js'
import accountRouter from '../routes/account.js';
import User from '../models/user.js';
import Account from '../models/account.js';
import { authenticateToken } from '../middlewares/auth.js';
import {v4 as uuid} from 'uuid';

const router = Router();
// seeding db
router.get('/seed', async (req, res) => {
    try{
        const userId = uuid();
        const users = [
            {userId: userId,fullName: 'Admin Test', accountNumber: '13', emailAddress: 'admin@mail.com', 
            registrationNumber: '234d'}
        ]
            
        const newUsers = await User.create(users);
        const accounts = [
            {userName: 'admin', password: 'admin', userId: userId},
        ]
        const newAccounts = await Account.create(accounts);
        res.json({newUsers, newAccounts});
    }catch(err){
        res.status(500).json({msg: 'Something went wrong'});
    }
})


router.use('/auth', loginRouter);
router.use('/users', authenticateToken, userRouter);
router.use('/accounts', authenticateToken, accountRouter);

export default router;