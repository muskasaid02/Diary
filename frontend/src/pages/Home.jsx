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
            const response = await fetch('http://localhost:3000/api/posts', {
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
            position: "fixed", // Ensures the Box spans the entire viewport
            top: 50, // Aligns to the top
            left: 0, // Aligns to the left
            backgroundColor: theme === "dark" ? "#1c1c1c" : "white", // Background color
            width: "100vw", // Full width of the viewport
            height: "100vh", // Full height of the viewport
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-color 0.3s ease", // Smooth transition
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Posts Section */}
                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: theme === 'dark' ? '#90caf9' : '#000',
                                mb: 3
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
                                marginLeft: '25px'
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
