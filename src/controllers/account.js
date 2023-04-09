import Account from '../models/account.js';

export const createAccount = async (req, res) => {
    const {userName} = req.body;

    const account = await Account.findOne({userName: userName});
    if(account){
        res.status(400).send({msg: 'userName already registered!'});
    }else{
        const newAcc = await Account.create(req.body);
        res.status(201).send({newAcc})
    }
}

export const getAllAccount = async (req, res) => {
    const accounts = await Account.find();
    res.json(accounts);
}

export const getAllAccByLastLogin = async (req, res) => {
    const days = parseInt(req.params.days);
    // get today's date and substract with days
    const rules = new Date(new Date().setDate(new Date().getDate() - days));
    const accounts = await Account.find({lastLoginDateTime: {$lt: rules}})
    res.json(accounts);
}

export const deleteAccByAccId = async (req, res) => {
    const {accountId} = req.params;
    const account = await Account.deleteOne({accountId: accountId});
    if(!account){
        res.status(404).send({msg: `Account with accountId: ${accountId} not found`});
    }
    res.json({account})
}

export const updateAccPasswordByAccId = async (req, res) => {
    const {accountId} = req.params;
    try{
        const updatedAcc = await Account.updateOne({accountId: accountId}, req.body, {new: true});
        res.json({updatedAcc});
    }catch(err){
        res.send(400);
    }
}

export const deleteAllAcc = async (req, res) => {
    try{
        const result = await Account.deleteMany({});
        res.status(200).send({msg: 'Accounts deleted'});
    }catch(err){
        res.send(500);
    }
}