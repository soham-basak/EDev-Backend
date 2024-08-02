import { Context } from 'hono';
import User from '../models/User';
import { hashPassword } from '../utils/password';

// @desc    Create user
// route    POST /api/v1/user
// access   private

export const createUserHandler = async (c: Context) => {
    const { username, email, password, type } = await c.req.json();
    console.log('Request body:', { username, email, password, type });
    

    if(!username || !email || !password || !type){
        return c.json({ error: 'Missing required field' }, 400);
    }

    const existingUser  = await User.findOne({email});

    if(existingUser){
        return c.json({ error: 'User already exists' }, 400);
    }

    const hashedPassword = await hashPassword(password);



    const newUser = new User({ username, email, password:hashedPassword ,type});
    // const newUser: User = { username, email, password: hashedPassword ,type};
    await newUser.save();

    console.log('User saved successfully');
    return c.json({ message: 'User saved successfully' }, 201);
}