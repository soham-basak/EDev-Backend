import mongoose, { Schema } from 'mongoose';
import { IContact } from '../../types';

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
