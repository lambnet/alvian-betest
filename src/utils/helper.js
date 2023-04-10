import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export function hashPassword(password){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

export function comparePassword(raw, hashed){
    return bcrypt.compareSync(raw, hashed);
}

export function generateToken(account){
    return jwt.sign({account}, process.env.TOKEN_SECRET, {expiresIn:'30m'});
}
