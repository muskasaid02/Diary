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
        it('should return 401 if not authenticated', async () => {
            const response = await request(app)
                .get('/api/posts');

            expect(response.status).toBe(401);
        });
    });
});
