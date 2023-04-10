import mongoose, { Schema } from 'mongoose';
import { hashPassword } from '../utils/helper.js';
import {v4 as uuid} from 'uuid';

const accountSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        default: uuid(),
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        set: hashPassword
    },
    lastLoginDateTime: {
        type: Date,
        default: Date.now()
    }, 
    userId: {
        type: String,
        ref: 'User',
        required: true,
        unique: true
    }
})

accountSchema.set('autoIndex', true);
const model = mongoose.model('Account', accountSchema);
export default model;