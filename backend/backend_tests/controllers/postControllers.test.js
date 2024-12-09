// backend_tests/controllers/postControllers.test.js
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../server';  // Adjust path as needed
import Post from '../../models/Post';
import User from '../../models/User';

describe('Post Controllers', () => {
    let token;
    let user;

    beforeEach(async () => {
        // Create a test user
        const userResponse = await request(app)
            .post('/api/user/signup')
            .send({
                email: 'test@test.com',
                password: 'Test123!'
            });
        
        token = userResponse.body.token;
        user = userResponse.body.user;
    });

    describe('GET /api/posts', () => {
        it('should get all posts for a user', async () => {
            // Create some test posts
            await Post.create([
                {
                    title: 'Test Post 1',
                    content: 'Content 1',
                    date: new Date(),
                    user_id: user._id
                },
                {
                    title: 'Test Post 2',
                    content: 'Content 2',
                    date: new Date(),
                    user_id: user._id
                }
            ]);

            const response = await request(app)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
        });

        it('should return 401 if not authenticated', async () => {
            const response = await request(app)
                .get('/api/posts');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/posts', () => {
        it('should create a new post', async () => {
            const postData = {
                title: 'New Post',
                content: 'New Content',
                date: new Date()
            };

            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(postData);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(postData.title);
            expect(response.body.user_id).toBe(user._id.toString());
        });

        it('should return 400 for invalid data', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/posts/:id', () => {
        it('should delete a post', async () => {
            const post = await Post.create({
                title: 'To Delete',
                content: 'Content',
                date: new Date(),
                user_id: user._id
            });

            const response = await request(app)
                .delete(`/api/posts/${post._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            const deletedPost = await Post.findById(post._id);
            expect(deletedPost).toBeNull();
        });

        it('should return 404 for non-existent post', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/posts/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
