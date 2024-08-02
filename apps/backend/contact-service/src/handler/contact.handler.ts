import { log } from "console";
import Contact from "../models/Contact";
import { Context } from "hono";

// @desc    Create blog comment
// route    POST /api/v1/create
// access   private

export const createContactHandler = async(c: Context) => {
    try {
        const { name,email,message} = await c.req.json();

        if (!name || !email || !message) {
            return c.json({ error: 'Missing required fields' }, 400);
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log('Contact saved successfully');
        return c.json({ message: 'Contact saved successfully' }, 201);
    } catch (error) {
        console.error('Error saving contact:', error);
        return c.json({ error: 'Failed to save contact' }, 500);
    }
}

export const getHello = async(c: Context) => {
    return c.json('Hello Hono!')
}

