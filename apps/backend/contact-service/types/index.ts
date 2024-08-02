import { Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    message: string;
}

export interface RateLimitOptions {
    windowMs: number;
    max: number;
}