import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    getAllPosts,
    getPost,
    createPost,
    deletePost,
    updatePost
} from '../controllers/postControllers.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', getAllPosts);

router.get('/:id', async (req, res, next) => {
    const { password } = req.query;  
    req.password = password;  
    next();
}, getPost);

router.post('/', async (req, res, next) => {
    const { password } = req.body; 
    req.password = password; 
    next();
}, createPost);

router.post('/with-image', upload.single('image'), async (req, res, next) => {
    const { password } = req.body;
    req.password = password;
    next();
}, createPostWithImage);


router.delete('/:id', deletePost);

router.patch('/:id', updatePost);

export default router;

