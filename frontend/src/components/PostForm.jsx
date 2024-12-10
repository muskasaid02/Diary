import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Box, Button, Container, MenuItem, TextField, Typography, Select, InputLabel, FormControl } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ThemeContext } from '../context/ThemeContext';

const PostForm = () => {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext);
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('neutral'); // New state for mood

    // Define editorModules and editorFormats outside of any function
    const editorModules = {
        toolbar: [
            [{ font: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const editorFormats = [
        'font',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'align',
        'link',
        'image',
    ];

    const onSubmit = async (data) => {
        const post = {
            date: data.date,
            title: data.title,
            content,
            mood, // Include mood in the request
            password: data.password || null,
        };

        try {
            const response = await fetch('https://diary-backend-utp0.onrender.com/api/posts', {
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (response.ok) {
                const newPost = await response.json();
                reset({ title: '', date: '', password: '' });
                setContent('');
                setMood('neutral'); // Reset mood to default
                dispatch({ type: 'CREATE_POST', payload: newPost });
                console.log('New post created:', newPost);
            } else {
                const errorMessage = await response.text();
                setError('submit', { message: errorMessage || 'An error occurred. Please try again.' });
            }
        } catch (err) {
            console.error('Error creating post:', err);
            setError('submit', { message: 'An unexpected error occurred. Please try again.' });
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '400px',
                    height: '550px',
                    p: 3,
                    boxShadow: theme === 'dark' ? '0px 4px 6px rgba(0, 0, 0, 0.5)' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                    backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    alignSelf: 'center',
                }}
            >
                <Typography
                    variant="h5"
                    align="center"
                    gutterBottom
                    sx={{
                        color: theme === 'dark' ? '#90caf9' : '#000',
                        transition: 'color 0.3s ease',
                    }}
                >
                    Create a Post
                </Typography>

                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    {...register('title', { required: 'Title is required' })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    InputProps={{
                        style: {
                            color: theme === 'dark' ? '#90caf9' : '#000', // Input text color
                        },
                    }}
                    InputLabelProps={{
                        style: { color: theme === 'dark' ? '#90caf9' : '#000' },
                    }}
                />

                <TextField
                    label="Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    {...register('date', { required: 'Date is required' })}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    InputProps={{
                        style: {
                            color: theme === 'dark' ? '#90caf9' : '#000', // Input text color
                        },
                    }}
                    InputLabelProps={{
                        style: { color: theme === 'dark' ? '#90caf9' : '#000' },
                        shrink: true, // Ensure the label stays above the field
                    }}
                />

                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={(value) => setContent(value)}
                    modules={editorModules}
                    formats={editorFormats}
                    style={{
                        backgroundColor: theme === 'dark' ? '#fff' : '#fff', // Keep white for readability
                        color: theme === 'dark' ? '#424242' : '#000',
                        minHeight: '150px',
                    }}
                />

                <FormControl fullWidth>
                    <InputLabel>Mood</InputLabel>
                    <Select
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                    >
                        <MenuItem value="happy">Happy</MenuItem>
                        <MenuItem value="sad">Sad</MenuItem>
                        <MenuItem value="excited">Excited</MenuItem>
                        <MenuItem value="anxious">Anxious</MenuItem>
                        <MenuItem value="neutral">Neutral</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Password (Optional)"
                    type="password"
                    variant="outlined"
                    fullWidth
                    {...register('password')}
                    helperText="Add a password to protect your post (optional)"
                    InputProps={{
                        style: {
                            color: theme === 'dark' ? '#90caf9' : '#000', // Input text color
                        },
                    }}
                    InputLabelProps={{
                        style: { color: theme === 'dark' ? '#90caf9' : '#000' },
                    }}
                    FormHelperTextProps={{
                        style: {
                            color: theme === 'dark' ? '#90caf9' : '#000', // Helper text color
                        },
                    }}
                />

                {errors.submit && (
                    <Typography variant="body2" color="error" align="center">
                        {errors.submit.message}
                    </Typography>
                )}

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    POST
                </Button>
            </Box>
        </Container>
    );
};

export default PostForm;