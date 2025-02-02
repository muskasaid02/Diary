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
    console.log('\n=== GET/POST POST REQUEST ===');
    const { id } = req.params;
    const { password } = req.body || {}; // Get password from request body

    console.log('Request details:', {
        id,
        hasPassword: !!password,
        method: req.method
    });

    try {
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post does not exist' });
        }

        console.log('Post found:', {
            id: post._id,
            hasStoredPassword: !!post.password
        });
        
        if (post.password) {
            // Log the exact string values we're comparing
            console.log('Comparison details:', {
                providedPassword: password,
                hashedPasswordLength: post.password.length,
                providedPasswordType: typeof password,
                storedHashType: typeof post.password
            });
            
            if (!password) {
                return res.status(403).json({ 
                    error: 'Password required', 
                    isPasswordProtected: true 
                });
            }

            try {
                // Clean up the password and hash before comparison
                const cleanPassword = password.trim();
                const storedHash = post.password.trim();
                
                console.log('About to compare password');
                const isMatch = await bcrypt.compare(cleanPassword, storedHash);
                console.log('Password verification result:', isMatch);

                if (!isMatch) {
                    return res.status(403).json({ 
                        error: 'Incorrect password',
                        isPasswordProtected: true 
                    });
                }
            } catch (bcryptError) {
                console.error('Error during password comparison:', bcryptError);
                return res.status(500).json({ error: 'Error verifying password' });
            }
        }

        console.log('Access granted');
        res.status(200).json(post);
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ error: err.message });
    }
};

export const createPost = async (req, res) => {
    const { date, title, content, password, mood } = req.body;
    const user_id = req.user._id;

    console.log("=== CREATE POST REQUEST ===");
    console.log("Received password:", password ? "Yes" : "No");

    try {
        let hashedPassword = null;
        if (password) {
            console.log("Hashing password...");
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
            console.log("Password hashed successfully");
            console.log("Hash generated:", hashedPassword);
        }

        const post = await Post.create({
            date,
            title,
            content,
            user_id,
            mood,
            password: hashedPassword,
        });

        console.log("Post created successfully");
        console.log("Post ID:", post._id);
        console.log("Has password protection:", !!post.password);

        res.status(200).json(post);
    } catch (err) {
        console.error("Error creating post:", err);
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