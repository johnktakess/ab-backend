import mongoose, { Document, Schema } from 'mongoose';


export interface IPost extends Document {
    title?: string;
    content?: string;
    author?: string;
    tags: string[];
}


const PostSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String },
    tags: { type: [String], default: [] },    
},{ collection: "posts" });

export default mongoose.model<IPost>('Post', PostSchema, "posts");
