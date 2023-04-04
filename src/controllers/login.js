import Account from '../models/account.js';
import { comparePassword, generateToken } from '../utils/helper.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const {userName, password} = req.body;
    const account = await Account.findOne({userName});

    if(!account){
        res.status(404).send({msg: 'userName is not registered'});
    }
    if(comparePassword(password, account.password)){
        const token = generateToken(account);
        // update last login timestamp
        account.lastLoginDateTime = Date.now();
        account.save();
        res.json({account, token});
    }else{
        res.status(401).send({msg: 'wrong userName or password'});
    }
}