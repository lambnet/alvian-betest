import Account from '../models/account.js';

const excludedFields = {_id:0, __v:0, password:0};

export const createAccount = async (req, res) => {
    const {userName, password, userId} = req.body;

    if(!userName || !password || !userId) res.status(400).json({msg: 'Fields are required'});

    try{
        const account = await Account.findOne({$or:[{userName: userName}, {userId: userId}]});
        if(account){
            res.status(401).json({msg: 'Account already exists'});
        }else{
            const newAcc = await Account.create(req.body);
            res.status(201).json({Account: newAcc})
        }
    }catch(err){
        res.status(500).json({msg: 'Something went wrong'})
    }
}

export const getAllAccount = async (req, res) => {
    try{
        const accounts = await Account.find({}, excludedFields);
        res.status(200).json({accounts});
    }catch(err){
        res.status(500).json({msg: 'Something went wrong'});
    }
  
}

export const getAllAccByLastLogin = async (req, res) => {
    const days = parseInt(req.params.days);
    // get today's date and substract with days
    const rules = new Date(new Date().setDate(new Date().getDate() - days));
    const accounts = await Account.find({lastLoginDateTime: {$lt: rules}}, excludedFields)
    res.status(200).json({accounts});
}

export const deleteAccByAccId = async (req, res) => {
    const {accountId} = req.params;
    if(!accountId) res.status(400).json({msg: 'accountId is required'});

    const account = await Account.deleteOne({accountId: accountId});
    if(!account){
        res.status(404).json({msg: `Account with accountId: ${accountId} not found`});
    }
    res.status(200).json({account})
}

export const updateAccPasswordByAccId = async (req, res) => {
    const {accountId} = req.params;
    const {password} = req.body.password;

    if(!accountId || password) res.status(400).json({msg: 'make sure to provide accountId or password'})
    
    const updatedAcc = await Account.updateOne({accountId: accountId}, password, {new: true}, excludedFields);
    if(!updatedAcc){
        res.status(404).json({msg: `Account with accountId: ${accountId} not found`});
    }
   res.status(200).json({updatedAcc});
}

// will be deleted after dev
export const deleteAllAcc = async (req, res) => {
    try{
        const result = await Account.deleteMany({});
        res.status(200).send({msg: 'Accounts deleted'});
    }catch(err){
        res.send(500);
    }
}