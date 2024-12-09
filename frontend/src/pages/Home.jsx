import { useEffect, useContext } from 'react';
import { usePostsContext } from '../hooks/usePostsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import PostHead from '../components/PostHead';
import PostForm from '../components/PostForm';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
    const { posts, dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext); // Access theme context

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('https://diary-backend-utp0.onrender.com/api/posts', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) dispatch({ type: 'SET_POSTS', payload: json });
        };

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
                    backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', // Set background color based on theme
                }}
            >
                <CircularProgress size={100} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: 'absolute', // Ensure it spans the whole screen
                top: 50,
                left: 0,
                right: 0,
                bottom: 0,
                minHeight: '1000vh', // Fallback for full height
                backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', // Dark mode background
                color: theme === 'dark' ? '#fff' : '#000', // Adjust text color
                padding: '20px',
                transition: 'background-color 0.3s ease', // Smooth transition for theme changes
            }}
        >
            <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: theme === 'dark' ? '#90caf9' : '#000', // Light blue in dark mode
                    }}
                >
                    Posts
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                        <Box
                            sx={{
                                padding: 2,
                                boxShadow: theme === 'dark' ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.1)', // Minimize shadows
                                borderRadius: 2,
                                backgroundColor: theme === 'dark' ? '#424242' : '#fff', // Dark mode post background
                                color: theme === 'dark' ? '#fff' : '#000', // Adjust text color
                                position: 'relative', // Remove any absolute positioning
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
        </Box>
    );
};

export default Home;
