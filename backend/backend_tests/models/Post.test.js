// backend_tests/models/Post.test.js
import mongoose from 'mongoose';
import Post from '../../models/Post';

describe('Post Model', () => {
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