import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Post from '../models/Post.js';  

export const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ error: 'authorization token required' });

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({ _id }).select('_id');
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'not authorized' });
    }
};

export const requireDiaryPassword = async (req, res, next) => {
    const { diaryId } = req.params;
    const { password } = req.body;

    try {
        const diaryEntry = await Post.findById(diaryId);

        if (!diaryEntry) {
            return res.status(404).json({ error: 'Diary entry not found' });
        }

        if (diaryEntry.password) {

            if (!password) {
                return res.status(401).json({ error: 'Password required to access this diary entry' });
            }

            // Compare the provided password with the hashed password
            const bcrypt = await import('bcrypt');
            const match = await bcrypt.compare(password, diaryEntry.password);
            if (!match) {
                return res.status(403).json({ error: 'Incorrect password' });
            }
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};
