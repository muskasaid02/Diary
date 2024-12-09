// backend_tests/routes/posts.test.js
import request from 'supertest';
import { app } from '../../server';
import Post from '../../models/Post';
import User from '../../models/User';

describe('Post Routes', () => {
    let token;
    let user;

    beforeEach(async () => {
        // Create a test user and get token
        const signupResponse = await request(app)
            .post('/api/user/signup')
            .send({
                email: 'test@test.com',
                password: 'Test123!'
            });
        
        token = signupResponse.body.token;
        user = signupResponse.body.user;
    });

    describe('GET /api/posts', () => {
        beforeEach(async () => {
            // Create test posts
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
        });

        it('should require authentication', async () => {
            const response = await request(app)
                .get('/api/posts');
            
            expect(response.status).toBe(401);
        });

        it('should get all posts for authenticated user', async () => {
            const response = await request(app)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('content');
        });
    });

    describe('GET /api/posts/:id', () => {
        let post;

        beforeEach(async () => {
            post = await Post.create({
                title: 'Single Post',
                content: 'Single Content',
                date: new Date(),
                user_id: user._id
            });
        });

        it('should get single post by id', async () => {
            const response = await request(app)
                .get(`/api/posts/${post._id}`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Single Post');
        });

        it('should return 404 for non-existent post', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .get(`/api/posts/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/posts', () => {
        it('should create new post for authenticated user', async () => {
            const newPost = {
                title: 'New Post',
                content: 'New Content',
                date: new Date()
            };

            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(newPost);
            
            expect(response.status).toBe(200);
            expect(response.body.title).toBe(newPost.title);
            expect(response.body.user_id).toBe(user._id.toString());
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/posts/:id', () => {
        let post;

        beforeEach(async () => {
            post = await Post.create({
                title: 'Delete Post',
                content: 'Delete Content',
                date: new Date(),
                user_id: user._id
            });
        });

        it('should delete post', async () => {
            const response = await request(app)
                .delete(`/api/posts/${post._id}`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toBe(200);
            
            const deletedPost = await Post.findById(post._id);
            expect(deletedPost).toBeNull();
        });

        it('should not delete post of different user', async () => {
            // Create another user
            const otherUserResponse = await request(app)
                .post('/api/user/signup')
                .send({
                    email: 'other@test.com',
                    password: 'Test123!'
                });
            
            const otherToken = otherUserResponse.body.token;

            const response = await request(app)
                .delete(`/api/posts/${post._id}`)
                .set('Authorization', `Bearer ${otherToken}`);
            
            expect(response.status).toBe(403);
        });
    });
});