import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const PostSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: false, 
        enum: ['Happy', 'Sad', 'Excited', 'Anxious', 'Neutral'], 
        default: 'neutral'
    },
    password: {
        type: String,
        required: false,
        default: null
    },
    location: {
        type: String,
        required: false,
        default: 'Unknown'  // Default value if location is not provided
    }
}, {
    collection: 'posts',
    timestamps: true
});



export default model('Post', PostSchema);