import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { ThemeContext } from '../context/ThemeContext';

const PostForm = () => {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext);
    const [content, setContent] = useState(''); // State for editor content

    const onSubmit = async data => {
        // Extract plain text from Quill content
        const quillElement = document.querySelector('.ql-editor');
        const plainText = quillElement ? quillElement.innerText.trim() : '';

        const post = {
            date: data.date,
            title: data.title,
            content: plainText, // Use content from the editor
            password: data.password || null,
        };

        try {
            const response = await fetch('https://diary-backend-utp0.onrender.com/api/posts', {
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const newPost = await response.json();
                reset({ title: '', date: '', password: '' });
                setContent(''); // Clear editor content
                dispatch({ type: 'CREATE_POST', payload: newPost });
                console.log('New post created', newPost);
            } else {
                setError('something went wrong', { type: 'manual' });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const editorModules = {
        toolbar: [
            [{ font: [] }], // Font dropdown
            ['bold', 'italic', 'underline', 'strike'], // Formatting options
            [{ list: 'ordered' }, { list: 'bullet' }], // List options
            [{ align: [] }], // Alignment
            ['link', 'image'], // Insert options
            ['clean'], // Remove formatting
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

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 3,
                    boxShadow: theme === 'dark' ? 3 : '0px 0px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                    backgroundColor: theme === 'dark' ? '#555' : 'white',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
            >
                <Typography
                    variant="h5"
                    align="center"
                    gutterBottom
                    sx={{
                        color: theme === 'dark' ? 'white' : 'black',
                        transition: 'color 0.3s ease',
                    }}
                >
                    Create a post
                </Typography>

                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                        style: { color: theme === 'dark' ? '#1E88E5' : 'black', transition: 'color 0.3s ease' },
                    }}
                    {...register('title', { required: 'Title is required' })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />

                <TextField
                    label="Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue in dark mode
                        },
                        shrink: true,
                    }}
                    inputProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue text for placeholder
                        },
                    }}
                    FormHelperTextProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue helper text in dark mode
                        },
                    }}
                    {...register("date", { required: 'Date is required' })}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                />

                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={editorModules}
                    formats={editorFormats}
                    style={{
                        backgroundColor: theme === 'dark' ? '#fff' : '#fff', // Keep white background
                        color: theme === 'dark' ? '#1E88E5' : 'black', // Text color
                        transition: 'color 0.3s ease',
                        minHeight: '150px',
                    }}
                />

                <TextField
                    label="Password (Optional)"
                    type="password"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue in dark mode
                        },
                    }}
                    inputProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue text in dark mode
                        },
                    }}
                    FormHelperTextProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue helper text in dark mode
                        },
                    }}
                    {...register("password")}
                    helperText="Add a password to protect your post (optional)"
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    POST
                </Button>
            </Box>
        </Container>
    );
};

export default PostForm;