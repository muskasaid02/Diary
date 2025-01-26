import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Box, Typography, Card, CardContent, Paper, TextField, Button } from '@mui/material';

const DiaryPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchPost = async () => {
            const headers = {
                Authorization: `Bearer ${user.token}`,
            };
            try {
                const response = await fetch(`https://diary-backend-utp0.onrender.com/api/posts/${id}`, {
                    method: 'GET',
                    headers,
                });
                if (response.ok) {
                    const json = await response.json();
                    setPost(json);
                } else {
                    setPasswordRequired(true);
                }
            } catch (err) {
                setError('Failed to load post.');
            }
        };

        if (user) fetchPost();
    }, [id, user]);

    if (!post && !passwordRequired) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white', // Background color
                    color: theme === 'dark' ? 'white' : 'black',
                }}
            >
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 50, // Add spacing to account for the header
                left: 0,
                right: 0,
                bottom: 0,
                minHeight: '100vh',
                backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white', // Dark mode background
                color: theme === 'dark' ? 'white' : 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                transition: 'background-color 0.3s ease',
            }}
        >
            {passwordRequired ? (
                <Paper
                    elevation={3}
                    sx={{
                        padding: '2rem',
                        maxWidth: '400px',
                        textAlign: 'center',
                        backgroundColor: theme === 'dark' ? '#424242' : 'white',
                        color: theme === 'dark' ? 'white' : 'black',
                    }}
                >
                    <Typography>Password Required</Typography>
                    <form>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                marginBottom: '1rem',
                                backgroundColor: theme === 'dark' ? '#616161' : 'inherit',
                            }}
                        />
                        <Button type="submit" variant="contained" fullWidth>
                            Submit
                        </Button>
                    </form>
                </Paper>
            ) : (
                <Card
                    sx={{
                        maxWidth: '800px',
                        padding: '2rem',
                        borderRadius: '8px',
                        backgroundColor: theme === 'dark' ? '#424242' : '#f5f5f5',
                        color: theme === 'dark' ? '#fff' : '#000',
                        boxShadow: theme === 'dark' ? '0px 4px 6px rgba(0, 0, 0, 0.5)' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {new Date(post.date).toLocaleString()}
                        </Typography>
                        <Typography
                            variant="body1"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default DiaryPost;