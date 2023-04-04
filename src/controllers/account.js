import Account from '../models/account.js';

export const createAccount = async (req, res) => {
    const {userName} = req.body;

    const account = await Account.findOne({userName});
    if(account){
        res.status(400).send({msg: 'userName already registered!'});
    }else{
        await Account.create(req.body);
        res.status(201)
    }
}

export const getAllAccount = async (req, res) => {
    const accounts = await Account.find();
    res.json(accounts);
}