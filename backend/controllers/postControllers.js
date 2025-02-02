import mongoose from 'mongoose';
import Post from '../models/Post.js';
import bcrypt from 'bcrypt';

export const getAllPosts = async (req, res) => {
    const user_id = req.user._id;

    try {
        const posts = await Post.find({ user_id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const getPost = async (req, res) => {
    console.log("\n=== GET POST REQUEST ===");
    const { id } = req.params;
    const { password } = req.query;

    console.log({
        requestId: id,
        attemptedPassword: password
    });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Post does not exist' });
    }

    try {
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post does not exist' });
        }

        if (post.password) {
            console.log({
                postId: post._id,
                storedHash: post.password,
                attemptingWithPassword: password
            });

            if (!password) {
                return res.status(403).json({ 
                    error: 'Password required', 
                    isPasswordProtected: true 
                });
            }

            // Test both trimmed and untrimmed versions
            const passwordTrimmed = password.trim();
            const passwordUntrimmed = password;

            const resultTrimmed = await bcrypt.compare(passwordTrimmed, post.password);
            const resultUntrimmed = await bcrypt.compare(passwordUntrimmed, post.password);

            console.log({
                trimmedResult: resultTrimmed,
                untrimmedResult: resultUntrimmed,
                passwordLength: password.length,
                trimmedPasswordLength: passwordTrimmed.length,
                hashLength: post.password.length
            });

            if (!resultTrimmed && !resultUntrimmed) {
                return res.status(403).json({ 
                    error: 'Incorrect password',
                    isPasswordProtected: true 
                });
            }
        }

        res.status(200).json(post);
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ error: err.message });
    }
};

export const createPost = async (req, res) => {
    const { date, title, content, password, mood } = req.body;
    const user_id = req.user._id;

    console.log("\n=== CREATE POST REQUEST ===");
    console.log("Original password received:", password);

    try {
        // Store unhashed password temporarily for verification
        let hashedPassword = null;
        if (password) {
            // Use fixed salt for testing
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
            
            // Immediate verification test
            const verifyTest = await bcrypt.compare(password, hashedPassword);
            
            console.log({
                originalPassword: password,
                generatedHash: hashedPassword,
                verificationTest: verifyTest
            });
        }

        const post = await Post.create({
            date,
            title,
            content,
            user_id,
            mood,
            password: hashedPassword
        });

        console.log("Post created with ID:", post._id);
        if (hashedPassword) {
            console.log("Saved hash:", post.password);
        }

        res.status(200).json(post);
    } catch (err) {
        console.error("Create Post Error:", err);
        res.status(400).json({ error: err.message });
    }
};


export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'post does not exist' });

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: 'post does not exist' });
        const deletedPost = await Post.findOneAndDelete( { _id: id });
        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'post does not exist' });

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: 'post does not exist' });
        const updatedPost = await Post.findOneAndUpdate( { _id: id }, { ...req.body });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

