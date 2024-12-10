import mongoose from 'mongoose';
import Post from '../../models/Post';
import dotenv from 'dotenv';

dotenv.config();

describe('Post Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a post successfully', async () => {
        const validPost = {
            title: 'Test Post',
            content: 'Test Content',
            date: new Date(),
            user_id: new mongoose.Types.ObjectId()
        };

        const post = await Post.create(validPost);
        expect(post.title).toBe(validPost.title);
        expect(post.content).toBe(validPost.content);
    });

    it('should fail without required fields', async () => {
        const invalidPost = {};
        
        await expect(Post.create(invalidPost))
            .rejects
            .toThrow();
    });
});
