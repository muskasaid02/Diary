import { useEffect, useContext } from 'react';
import { usePostsContext } from '../hooks/usePostsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import PostHead from '../components/PostHead';
import PostForm from '../components/PostForm';
import { Grid, Box, Typography, CircularProgress, Container, Chip, Button} from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import { useState } from 'react';


const Home = () => {
    const { posts, dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext); // Access theme context
    const [selectedTags, setSelectedTags] = useState([]);
    const [isTagFilterActive, setIsTagFilterActive] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('http://localhost:4000/api/posts', {
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

    const filteredPosts = posts.filter(post => {
        console.log("Post being filtered:", post); 
        console.log("Current tags for post:", post.tags); 
        if (!isTagFilterActive) return true;
        return selectedTags.length === 0 || 
               (post.tags && post.tags.some(tag => selectedTags.includes(tag)));
    });

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

                        <Box sx={{ 
                            mb: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1 
                        }}>
                            <Button
                                sx={{
                                    minWidth: 'auto',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    p: 0,
                                    backgroundColor: isTagFilterActive ? '#1976d2' : 'transparent',
                                    border: '1px solid #1976d2',
                                    '&:hover': {
                                        backgroundColor: isTagFilterActive ? '#1565c0' : 'rgba(25, 118, 210, 0.04)',
                                    }
                                }}
                                onClick={() => setIsTagFilterActive(!isTagFilterActive)}
                            />
                            {Array.from(new Set(posts.flatMap(post => post.tags || []))).map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onClick={() => setSelectedTags(prev =>
                                        prev.includes(tag)
                                            ? prev.filter(t => t !== tag)
                                            : [...prev, tag]
                                    )}
                                    color={selectedTags.includes(tag) ? "primary" : "default"}
                                />
                            ))}
                        </Box>
                        <Grid container spacing={2}>
                            {filteredPosts.map(post => (
                                <Grid item xs={12} sm={6} key={post._id}>
                                    <PostHead post={post} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

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
