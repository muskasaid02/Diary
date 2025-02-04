import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Box, Button, Container, MenuItem, TextField, Typography, Select, InputLabel, FormControl } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ThemeContext } from '../context/ThemeContext';
import GeotagLocation from './GeotagLocation.jsx';

// ReactQuill toolbar options
const toolbarOptions = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ]
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];

const PostForm = () => {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext);
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');

    const onSubmit = async (data) => {
        console.log("Selected location before submission:", location);

        const post = {
            date: data.date,
            title: data.title,
            content: content,
            mood: mood,
            password: data.password ? data.password : null,
            location: location,
        };

        console.log("Submitting post data:", post);

        try {
            const response = await fetch('http://localhost:4000/api/posts', {
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const json = await response.json();
            console.log("Response status:", response.status);
            console.log("Server response:", json);

            if (response.ok) {
                reset({ title: '', date: '', password: '' });
                setContent('');
                setMood('neutral');
                setLocation('');
                dispatch({ type: 'CREATE_POST', payload: json });
            } else {
                console.error("Failed to create post:", json);
                setError('submit', { message: json.error || 'An error occurred.' });
            }
        } catch (err) {
            console.error("Error creating post:", err);
            setError('submit', { message: 'An unexpected error occurred.' });
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
                    height: '700px',
                    p: 3,
                    boxShadow: theme === 'dark' ? '0px 4px 6px rgba(0, 0, 0, 0.5)' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                    backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    alignSelf: 'center',
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
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
                            color: theme === 'dark' ? '#90caf9' : '#000',
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
                            color: theme === 'dark' ? '#90caf9' : '#000',
                        },
                    }}
                    InputLabelProps={{
                        style: { color: theme === 'dark' ? '#90caf9' : '#000' },
                        shrink: true,
                    }}
                />

                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={(value) => setContent(value)}
                    modules={toolbarOptions}
                    formats={formats}
                    style={{
                        backgroundColor: theme === 'dark' ? '#fff' : '#fff',
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
                        <MenuItem value="Happy">Happy</MenuItem>
                        <MenuItem value="Sad">Sad</MenuItem>
                        <MenuItem value="Excited">Excited</MenuItem>
                        <MenuItem value="Anxious">Anxious</MenuItem>
                        <MenuItem value="Neutral">Neutral</MenuItem>
                    </Select>
                </FormControl>

                <GeotagLocation onLocationSelect={setLocation} />

                <TextField
                    label="Password (Optional)"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    {...register('password')}
                    onChange={(e) => setPassword(e.target.value)}
                    helperText="Add a password to protect your post (optional)"
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
