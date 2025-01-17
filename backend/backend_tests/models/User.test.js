import mongoose from "mongoose";
import User from "../../models/User";
import mockingoose from "mockingoose";
import { jest } from "@jest/globals";
import bcrypt from "bcrypt";


describe("User Model - Mocked Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockingoose.resetAll();
    });

    describe("User.signup static method", () => {
        it("should create a new user", async () => {
            const userData = {
                email: "test@test.com",
                password: "Test123!",
            };

            const hashedPassword = "$2b$10$hashedpassword"; // Simulated bcrypt hash
            mockingoose(User).toReturn({ ...userData, password: hashedPassword }, "save");

            const user = await User.signup(userData.email, userData.password);

            expect(user.email).toBe(userData.email);
            expect(user.password).not.toBe(userData.password); // Should be hashed
        });

        it("should not create user with invalid email", async () => {
            mockingoose(User).toReturn(new Error("invalid email"), "save");

            await expect(User.signup("invalid-email", "Test123!")).rejects.toThrow("invalid email");
        });
    });

    describe("User.login static method", () => {

        it("should login a valid user", async () => {
            const userData = {
                email: "test@test.com",
                password: await bcrypt.hash("Test123!", 10), // Simulate hashing
            };

            // Ensure `findOne` returns a user with a hashed password
            jest.spyOn(User, "findOne").mockResolvedValue(userData);

            const user = await User.login("test@test.com", "Test123!");

            expect(user.email).toBe("test@test.com");

            // Cleanup mock
            jest.restoreAllMocks();
        });


        it("should not login with incorrect password", async () => {
            const userData = {
                email: "test@test.com",
                password: await bcrypt.hash("Test123!", 10), // Simulated hashed password
            };
        
            jest.spyOn(User, "findOne").mockResolvedValue(userData);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false); // Simulate password mismatch
        
            await expect(User.login("test@test.com", "WrongPass123!"))
                .rejects
                .toThrow("incorrect password");
        
            // Cleanup
            jest.restoreAllMocks();
        });
        

        it("should not login unregistered email", async () => {
            mockingoose(User).toReturn(null, "findOne");

            await expect(User.login("notregistered@test.com", "Test123!")).rejects.toThrow("email not registered");
        });
    });
});
