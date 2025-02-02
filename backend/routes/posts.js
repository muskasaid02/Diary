import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { 
    getAllPosts,
    checkPost,
    verifyPostPassword,
    createPost,
    deletePost,
    updatePost
 } from '../controllers/postControllers.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:id/check', checkPost);     // New endpoint to check if post exists
router.post('/:id/verify', verifyPostPassword);  // New endpoint to verify password
router.delete('/:id', deletePost);
router.patch('/:id', updatePost);

export default router;