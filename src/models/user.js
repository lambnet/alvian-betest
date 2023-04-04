import mongoose, { Schema } from 'mongoose';
import {v4 as uuid} from 'uuid';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        default: uuid(),
    },
    fullName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: Date,
        required: true,
        default: Date.now()
    }, 
    registrationNumber: {
        type: String, 
        required: true
    }
})

userSchema.index({userId: 1});
const model = mongoose.model('User', userSchema);
export default model;