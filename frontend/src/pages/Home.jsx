import { useEffect, useContext } from 'react';
import { usePostsContext } from '../hooks/usePostsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import PostHead from '../components/PostHead';
import PostForm from '../components/PostForm';
import { Grid, Box, Typography, CircularProgress, Container } from '@mui/material';
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
                    backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff',
                }}
            >
                <CircularProgress size={100} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: "fixed",
                top: 50,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme === "dark" ? "#1c1c1c" : "white",
                width: "100%",
                height: "calc(100vh - 50px)", // Subtract the top offset
                overflowY: "auto", // Add scroll for content
                transition: "background-color 0.3s ease",
                backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                minHeight: '100vh',
                padding: '20px',
                transition: 'background-color 0.3s ease',
            }}
        >
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Grid container spacing={4}>
                    {/* Posts Section */}
                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: theme === 'dark' ? '#90caf9' : '#000',
                                mb: 3,
                                textAlign: 'left'
                            }}
                        >
                            Posts
                        </Typography>
                        <Grid container spacing={2}>
                            {posts.map(post => (
                                <Grid item xs={12} sm={6} key={post._id}>
                                    <PostHead post={post} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
    
                    {/* Form Section */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: theme === 'dark' ? '#90caf9' : '#000',
                                mb: 3,
                                marginLeft: '25px',
                                textAlign: 'left'
                            }}
                        >
                            Create a Post
                        </Typography>
                        <PostForm />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;