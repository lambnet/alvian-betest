import User from '../models/user.js';
import redisClient from '../middlewares/cache.js';

const excludedFields = {_id:0, __v:0};

export const createUser = async (req, res) => {
    const { fullName, accountNumber, emailAddress, registrationNumber } = req.body;
    
    if(!fullName || !accountNumber || !emailAddress || !registrationNumber) 
        res.status(400).json({msg: 'Fields are required'});
    
    try{
        const user = await User.findOne({emailAddress: emailAddress});
        if(user){
            res.status(400).json({msg: 'This email already registered!'});
        }else{
            const user = await User.create(req.body);
            res.status(201).json({user});
        }
    }catch(err){
        res.status(500).json({msg: 'Something went wrong'});
    }
}

export const getAllUser = async (req, res) => {
    let results;
    try{
        results = await User.find({}, excludedFields);
        if(results.length === 0){
            throw 'API return empty'
        }
        await redisClient.set('AllUsers', JSON.stringify(results), {
            EX: 60,
            NX: true
        });

        res.send({
            fromCache: false,
            data: results
        });
    }catch(err){
        console.log(err)
        res.status(404).json({msg: 'Data unavailable'});
    }
}

export const getUserByAccNumber = async(req, res) => {
    const {accNumber} = req.params;
    const user = await User.findOne({accountNumber: accNumber}, excludedFields);
    if(!user){
        res.status(404).json({msg: `User with accountNumber: ${accNumber} not found`});
    }
    res.json({user});
}

export const getUserByRegNumber = async (req, res) => {
    const {regNumber} = req.params;
    const user = await User.findOne({registrationNumber: regNumber}, excludedFields);
    if(!user){
        res.status(404).json({msg: `User with registrationNumber: ${regNumber} not found`});
    }
    res.json({user});
}

export const deleteUserByUserId = async (req, res) => {
    const {userId} = req.params;
    const user = await User.deleteOne({userId: userId});
    if(!user){
        res.status(404).json({msg: `User with userId: ${userId} not found`});
    }
    res.json({user})
}

export const updateUserByUserId = async (req, res) => {
    const userId = req.params.userId;
    try{
        const updatedUser = await User.updateOne({userId: userId}, req.body, {new: true}, excludedFields);
        res.json({updatedUser});
    }catch(err){
        res.send(400).json({msg: `User with userId: ${userId} not found`});
    }
 }