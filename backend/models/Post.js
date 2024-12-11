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
        enum: ['happy', 'sad', 'excited', 'anxious', 'neutral'], 
        default: 'neutral'
    },

    password: {
        type: String,
        required: false
    }

}, {
    collection: 'posts',
    timestamps: true
});

PostSchema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (err) {
            return next(err);
        }
    }
    next();
});

export default model('Post', PostSchema);