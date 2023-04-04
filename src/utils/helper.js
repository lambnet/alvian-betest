import bcrypt from 'bcrypt';

export function hashPassword(password){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

export function comparePassword(raw, hashed){
    return bcrypt.compareSync(raw, hashed);
}