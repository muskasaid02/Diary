// backend_tests/controllers/userControllers.test.js
import request from 'supertest';
import { app } from '../../server';
import User from '../../models/User';

describe('User Controllers', () => {
    describe('POST /api/user/signup', () => {
        it('should create a new user', async () => {
            const response = await request(app)
                .post('/api/user/signup')
                .send({
                    email: 'test@test.com',
                    password: 'Test123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.email).toBe('test@test.com');
        });

        it('should not create user with invalid email', async () => {
            const response = await request(app)
                .post('/api/user/signup')
                .send({
                    email: 'invalid-email',
                    password: 'Test123!'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeTruthy();
        });

        it('should not create user with weak password', async () => {
            const response = await request(app)
                .post('/api/user/signup')
                .send({
                    email: 'test@test.com',
                    password: 'weak'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeTruthy();
        });
    });

    describe('POST /api/user/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/user/signup')
                .send({
                    email: 'test@test.com',
                    password: 'Test123!'
                });
        });

        it('should login existing user', async () => {
            const response = await request(app)
                .post('/api/user/login')
                .send({
                    email: 'test@test.com',
                    password: 'Test123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.email).toBe('test@test.com');
        });

        it('should not login with incorrect password', async () => {
            const response = await request(app)
                .post('/api/user/login')
                .send({
                    email: 'test@test.com',
                    password: 'WrongPass123!'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeTruthy();
        });

        it('should not login non-existent user', async () => {
            const response = await request(app)
                .post('/api/user/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: 'Test123!'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeTruthy();
        });
    });
});