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
    console.log('BASIC TEST LOG - getPost called');  // Very basic log
    const { id } = req.params;
    const { password } = req.query;

    console.log('Request params:', { id, password });  // Simple log of received data

    try {
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post does not exist' });
        }

        // Simple check to see if we get here
        console.log('Post found:', post._id);
        
        if (post.password) {
            console.log('Post is password protected');  // Check if this runs
            
            if (!password) {
                return res.status(403).json({ 
                    error: 'Password required', 
                    isPasswordProtected: true 
                });
            }

            const isMatch = await bcrypt.compare(password, post.password);
            console.log('Password check result:', isMatch);  // Log the result

            if (!isMatch) {
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