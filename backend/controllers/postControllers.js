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
    const { id } = req.params;
    const password = req.query.password ? decodeURIComponent(req.query.password) : null;

    console.log('==== GET POST REQUEST ====');
    console.log('Post ID:', id);
    console.log('Received encoded password:', req.query.password);
    console.log('Decoded password:', password);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid post ID');
        return res.status(404).json({ error: 'Post does not exist' });
    }

    try {
        const post = await Post.findById(id);
        
        if (!post) {
            console.log('Post not found');
            return res.status(404).json({ error: 'Post does not exist' });
        }

        console.log('Post found');
        console.log('Stored hashed password:', post.password);
        console.log('Post has password:', !!post.password);

        // Check if post is password protected
        if (post.password) {
            console.log('Post is password protected');
            
            // If no password provided
            if (!password) {
                console.log('No password provided for protected post');
                return res.status(403).json({ 
                    error: 'Password required', 
                    isPasswordProtected: true 
                });
            }

            // Verify password
            try {
                // Ensure both the stored hash and provided password are strings
                const storedHash = String(post.password);
                const providedPassword = String(password);

                console.log('About to compare:');
                console.log('Provided password:', providedPassword);
                console.log('Stored hash:', storedHash);

                const isMatch = await bcrypt.compare(providedPassword, storedHash);
                console.log('Password verification result:', isMatch);

                if (!isMatch) {
                    console.log('Password verification failed');
                    return res.status(403).json({ 
                        error: 'Incorrect password',
                        isPasswordProtected: true 
                    });
                }

                console.log('Password verified successfully');
            } catch (error) {
                console.error('Error in password comparison:', error);
                return res.status(500).json({ error: 'Error verifying password' });
            }
        }

        console.log('Returning post data');
        res.status(200).json(post);
    } catch (err) {
        console.error('Error in getPost:', err);
        res.status(400).json({ error: err.message });
    }
};

export const createPost = async (req, res) => {
    const { date, title, content, password, mood } = req.body;
    const user_id = req.user._id;

    console.log('==== CREATE POST REQUEST ====');
    console.log('Creating post with password:', !!password);

    try {
        let hashedPassword = null;
        if (password) {
            // Use a fixed salt rounds value
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log('Original password:', password);
            console.log('Generated hash:', hashedPassword);
        }

        const post = await Post.create({
            date,
            title,
            content,
            user_id,
            mood,
            password: hashedPassword,
        });

        console.log('Post created successfully');
        console.log('Stored password hash:', post.password);

        res.status(200).json(post);
    } catch (err) {
        console.error('Error creating post:', err);
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