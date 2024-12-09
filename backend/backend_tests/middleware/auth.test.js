// backend_tests/middleware/auth.test.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { requireAuth } from '../../middleware/auth';
import User from '../../models/User';
import { jest } from '@jest/globals';  
process.env.JWT_SECRET = 'test-secret'; //mocked in order to pass tests

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            headers: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    it('should authenticate valid token', async () => {
        const user = await User.create({
            email: 'test@test.com',
            password: 'hashedpassword'
        });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        mockReq.headers.authorization = `Bearer ${token}`;

        await requireAuth(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.user).toBeTruthy();
    });

    it('should return 401 if no token provided', async () => {
        await requireAuth(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'authorization token required'
        });
    });

    it('should return 401 for invalid token', async () => {
        mockReq.headers.authorization = 'Bearer invalid-token';

        await requireAuth(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'not authorized'
        });
    });
});