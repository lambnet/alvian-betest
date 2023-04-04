import { Router } from 'express';
import loginRouter from '../routes/login.js';
import userRouter from '../routes/user.js'
import accountRouter from '../routes/account.js';
import User from '../models/user.js';
import Account from '../models/account.js';
import { authenticateToken } from '../middlewares/auth.js';
import mongoose from 'mongoose';


const router = Router();

// seeding db
router.get('/seed', async (req, res) => {
    const users = [
        {fullName: 'Admin Test', accountNumber: '13', emailAddress: 'admin@mail.com', registrationNumber: '234d'}]
    
    const newUsers = await User.create(users);
    const accounts = [
        {userName: 'admin', password: 'admin', userId: newUsers.userId},
    ]

    const newAccounts = await Account.create(accounts);

    res.json({newUsers, newAccounts});
})

router.get('/connect/:account/:user', async (req, res) => {
    req.params.owner = new mongoose.Types.ObjectId(req.params.owner);
    const account = await Account.findByIdAndUpdate(req.params.account, {userId: req.params.user});
    res.json(account);
})


router.use('/auth',loginRouter);
router.use('/users', authenticateToken, userRouter);
router.use('/accounts', authenticateToken, accountRouter);

export default router;