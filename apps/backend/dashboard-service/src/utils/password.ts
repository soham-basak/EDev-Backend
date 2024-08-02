import bcrypt from 'bcrypt';
import {env} from '../validations/env';

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
}

export const comparePassword = async (enderedPassword: string, storedPassword: string): Promise<boolean> => {
    return bcrypt.compare(enderedPassword, storedPassword);
}
