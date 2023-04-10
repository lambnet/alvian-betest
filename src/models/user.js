import mongoose, { Schema } from 'mongoose';
import {v4 as uuid} from 'uuid';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        default: uuid(),
    },
    fullName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
    }, 
    registrationNumber: {
        type: String, 
        required: true,
        unique: true,
    }
})

userSchema.set('autoIndex', true);
const model = mongoose.model('User', userSchema);
export default model;