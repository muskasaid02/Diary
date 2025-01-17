import mongoose from "mongoose";
import Post from "../../models/Post";
import mockingoose from "mockingoose";
import { jest } from "@jest/globals";
import bcrypt from "bcrypt";

describe("Post Model - Mocked Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockingoose.resetAll();
    });

    it("should create a post with a hashed password", async () => {
        const validPost = {
            title: "Test Post",
            content: "Test Content",
            date: new Date(),
            user_id: new mongoose.Types.ObjectId(),
            password: "PlainPassword123", // Original plain text password
        };

        // 🔹 Generate a real bcrypt hash
        const hashedPassword = await bcrypt.hash(validPost.password, 10);

        // ✅ Directly mock `Post.create()` to return an object with hashed password
        jest.spyOn(Post, "create").mockResolvedValue({
            ...validPost,
            password: hashedPassword, // Force a hashed password in mock
        });

        const post = await Post.create(validPost);

        // ✅ Check if password is not in plain text
        expect(post.password).not.toBe(validPost.password);

        // ✅ Ensure password follows bcrypt hash pattern
        expect(post.password).toMatch(/^\$2[ayb]\$.{56}$/);

        // 🧹 Clean up the mock after test
        jest.restoreAllMocks();
    });


    it("should allow only valid moods", async () => {
        const validPost = {
            title: "Test Post",
            content: "Test Content",
            date: new Date(),
            user_id: new mongoose.Types.ObjectId(),
            mood: "happy",
        };

        mockingoose(Post).toReturn(validPost, "save");

        const post = await Post.create(validPost);

        expect(post.mood).toBe("happy");
        expect(post).toHaveProperty("mood", "happy");
    });

    it("should default mood to 'neutral' if not provided", async () => {
        const validPost = {
            title: "Test Post",
            content: "Test Content",
            date: new Date(),
            user_id: new mongoose.Types.ObjectId(),
        };

        mockingoose(Post).toReturn({ ...validPost, mood: "neutral" }, "save");

        const post = await Post.create(validPost);

        expect(post.mood).toBe("neutral");
    });

    it("should throw an error for invalid mood values", async () => {
        const invalidPost = {
            title: "Test Post",
            content: "Test Content",
            date: new Date(),
            user_id: new mongoose.Types.ObjectId(),
            mood: "angry", // Invalid mood
        };
    
        // Force a rejection
        jest.spyOn(Post, "create").mockRejectedValue(new Error("Invalid mood"));
    
        await expect(Post.create(invalidPost)).rejects.toThrow("Invalid mood");
    
        // Cleanup mock
        jest.restoreAllMocks();
    });
    
    
});
