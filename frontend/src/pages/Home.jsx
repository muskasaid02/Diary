import { useEffect } from 'react';
import { usePostsContext } from '../hooks/usePostsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import PostHead from '../components/PostHead';
import PostForm from '../components/PostForm';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';

const Home = () => {
    const { posts, dispatch } = usePostsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('https://diary-backend-utp0.onrender.com/api/posts', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) dispatch({ type: 'SET_POSTS', payload: json });
        }

        if (user) fetchPosts();
    }, [user, dispatch]);

    if (!posts) {
        return (
            <Box
                sx={{
                    width: '200px',
                    height: '200px',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress size={100} />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                    Posts
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ marginTop: '20px' }}>
                {posts && posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                        <Box
                            sx={{
                                padding: 2,
                                boxShadow: 3,
                                borderRadius: 2,
                                backgroundColor: '#fff',
                            }}
                        >
                            <PostHead post={post} />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ marginTop: '20px' }}>
                <PostForm />
            </Box>
        </>
    );
};

export default Home;
