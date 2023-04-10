import Account from '../models/account.js';
import { comparePassword, generateToken } from '../utils/helper.js';

export const login = async (req, res) => {
    const {userName, password} = req.body;
 
    if(!userName || !password) 
        res.status(400).json({msg: 'userName and password required'});
    
    try{
        const account = await Account.findOne({userName: userName});
        if(!account)
           res.status(404).json({msg: 'userName is not registered'});
    
        if(comparePassword(password, account.password)){
            const token = generateToken(account);
            // update last login timestamp
            account.lastLoginDateTime = Date.now();
            account.save();
            res.status(200).json({account, token});
        }else{
            res.status(401).json({msg: 'wrong userName or password'});
        }
    }catch(err){
        res.status(500).json({msg: 'Something went wrong'})
    }
}