// backend_tests/models/User.test.js
import User from '../../models/User';

describe('User Model', () => {
    describe('User.signup static method', () => {
        it('should create a new user', async () => {
            const user = await User.signup('test@test.com', 'Test123!');
            expect(user.email).toBe('test@test.com');
            expect(user.password).not.toBe('Test123!');
        });

        it('should not create user with invalid email', async () => {
            await expect(User.signup('invalid-email', 'Test123!'))
                .rejects
                .toThrow('invalid email');
        });
    });

    describe('User.login static method', () => {
        beforeEach(async () => {
            await User.signup('test@test.com', 'Test123!');
        });

        it('should login valid user', async () => {
            const user = await User.login('test@test.com', 'Test123!');
            expect(user.email).toBe('test@test.com');
        });

        it('should not login with wrong password', async () => {
            await expect(User.login('test@test.com', 'WrongPass123!'))
                .rejects
                .toThrow('incorrect password');
        });
    });
});