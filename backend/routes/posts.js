import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { 
    getAllPosts,
    getPost,
    createPost,
    deletePost,
    updatePost,
    verifyPassword
} from '../controllers/postControllers.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:id', getPost);
router.delete('/:id', deletePost);
router.patch('/:id', updatePost);
router.post('/:id/verify', verifyPassword); 

export default router;