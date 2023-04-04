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
    const user = await User.findOne({accountNumber: accNumber});
    if(!user){
        res.status(404).send({msg: `User with accountNumber: ${accNumber} not found`});
    }
    res.json({user});
}