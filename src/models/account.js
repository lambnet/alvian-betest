import mongoose, { Schema } from 'mongoose';
import { hashPassword } from '../utils/helper';
import {v4 as uuid} from 'uuid';

const accountSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        unique: true,
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

accountSchema.index({accountId: 1});
const model = mongoose.model('Account', accountSchema);
export default model;