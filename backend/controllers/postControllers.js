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
    const { password } = req.body;  

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'post does not exist' });
    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: 'post does not exist' });
        if (post.password) {
            if (!password) {
                return res.status(401).json({ error: 'Password required to access this post' });
            }
            const isMatch = await bcrypt.compare(password, post.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const createPost = async (req, res) => {
    const { date, title, content, password } = req.body; 
    const user_id = req.user._id;
    try {
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }
        const post = await Post.create({ date, title, content, user_id, password: hashedPassword });
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'post does not exist' });

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: 'post does not exist' });
        const deletedPost = await Post.findOneAndDelete({ _id: id });
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

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedPost = await Post.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const createPostWithImage = async (req, res) => {
    const { date, title, content, password } = req.body;
    const user_id = req.user._id;
    const image = req.file ? req.file.location : null;

    try {
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const post = await Post.create({ date, title, content, user_id, image, password: hashedPassword });
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};