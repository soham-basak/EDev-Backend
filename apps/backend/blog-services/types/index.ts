import { Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    slug:string;
    isFeatured:boolean;
    isLatest:boolean;
    coverImg: string;
    category: string;
    excerpt: string;
    content: string;
    author: string;
    tags: string[];
    createdAt: Date;
}
