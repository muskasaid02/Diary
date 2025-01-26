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
                    method: 'GET', // Use GET to fetch post initially
                    headers,
                });

                if (response.ok) {
                    const json = await response.json();
                    if (json.password) {
                        setPasswordRequired(true); // If password exists in post, prompt user
                    } else {
                        setPost(json);
                    }
                } else {
                    setError('Post not found.');
                }
            } catch (err) {
                setError('Failed to load post.');
            }
        };

        if (user && id) fetchPost();
    }, [id, user]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const headers = {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(`https://diary-backend-utp0.onrender.com/api/posts/${id}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                const json = await response.json();
                setPost(json);
                setPasswordRequired(false);
            } else {
                setError('Incorrect password, please try again.');
            }
        } catch (err) {
            setError('Failed to validate password.');
        }
    };

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!post && !passwordRequired) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 50,
                left: 0,
                right: 0,
                bottom: 0,
                minHeight: '100vh',
                backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white',
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
                    <Typography variant="h6" gutterBottom>
                        This post is password-protected.
                    </Typography>
                    <form onSubmit={handlePasswordSubmit}>
                        <TextField
                            label="Enter Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                marginBottom: '1rem',
                                backgroundColor: theme === 'dark' ? '#616161' : 'inherit',
                            }}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </form>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
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

