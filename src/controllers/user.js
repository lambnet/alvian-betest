import User from '../models/user.js';

export const createUser = async (req, res) => {
    const { emailAddress } = req.body;
    
    const user = await User.findOne({emailAddress});
    if(user){
        console.log(user)
        res.status(400).send({msg: 'This email already registered!'});
    }else{
        const user = await User.create(req.body);
        res.status(201).send(user);
    }
    
}

export const getAllUser = async (req, res) => {
    const users = await User.find();
    res.json(users);
}

export const getUserByAccNumber = async(req, res) => {
    const {accNumber} = req.params;
    const user = await User.findOne({accNumber});
    if(!user){
        res.status(404).send({msg: `User with accountNumber: ${accNumber} not found`});
    }
    res.json({user});
}

export const deleteUserByUserId = async (req, res) => {
    const {userId} = req.params;
    const user = await User.deleteOne({userId});
    if(!user){
        res.status(404).send({msg: `User with userId: ${userId} not found`});
    }
    res.json({user})
}

export const updateUserByUserId = async (req, res) => {
    const userId = req.params.userId;
    try{
        const updatedUser = await User.updateOne({userId}, req.body, {new: true});
        res.send({updatedUser});
    }catch(err){
        res.send(400).send({msg: `User with userId: ${userId} not found`});
    }
 }

 export const deleteAllUser = async (req, res) => {
    try{
        const result = await User.deleteMany({});
        res.status(200).send({msg: 'Users deleted'});
    }catch(err){
        res.status(500);
    }
 }