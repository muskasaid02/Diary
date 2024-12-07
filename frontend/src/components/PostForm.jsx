import { useForm } from 'react-hook-form';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Box, Button, Container, TextField, Typography, Input } from '@mui/material';
import { useState } from 'react';

const PostForm = () => {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://api.gofile.io/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok && result.status === 'ok') {
            return result.data.downloadPage;
        } else {
            throw new Error('File upload failed');
        }
    };

    const onSubmit = async (data) => {
        try {
            let fileUrl = null;
            if (file) {
                fileUrl = await uploadFile(file);
            }

            const post = {
                date: data.date,
                title: data.title,
                content: data.content,
                password: data.password || null,
                fileUrl // Include the uploaded file's URL
            };

            const response = await fetch('https://diary-backend-utp0.onrender.com/api/posts', {
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const body = await response.text();
            const newPost = JSON.parse(body);

            if (!response.ok) {
                setError('something went wrong', { type: 400 });
            }

            if (response.ok) {
                reset({ title: '', date: '', content: '', password: '' });
                setFile(null); // Reset file input
                dispatch({ type: 'CREATE_POST', payload: newPost });
                console.log('new post created', newPost);
            }
        } catch (err) {
            console.log(err);
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
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white'
    }}
>
    <Typography variant="h5" align="center" gutterBottom>
        Create a post
    </Typography>

    <TextField
        label="Title"
        variant="outlined"
        fullWidth
        {...register("title", { required: 'Title is required' })}
        error={!!errors.title}
        helperText={errors.title?.message}
    />

    <TextField
        label="Date"
        type="date"
        variant="outlined"
        fullWidth
        InputLabelProps={{ shrink: true }}
        {...register("date", { required: 'Date is required' })}
        error={!!errors.date}
        helperText={errors.date?.message}
    />

    {/* Mood selection dropdown */}
    <Typography variant="subtitle1">Mood</Typography>
    <select {...register("mood", { required: true })}>
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="excited">😃 Excited</option>
        <option value="anxious">😟 Anxious</option>
        <option value="neutral">😐 Neutral</option>
    </select>

    <TextField
        label="Content"
        variant="outlined"
        fullWidth
        multiline
        rows={8}
        {...register("content", { required: 'Content is required' })}
        error={!!errors.content}
        helperText={errors.content?.message}
    />

    <TextField
        label="Password (Optional)"
        type="password"
        variant="outlined"
        fullWidth
        {...register("password")}
        helperText="Add a password to protect your post (optional)"
    />

    <Input
        type="file"
        onChange={handleFileChange}
        inputProps={{ accept: '*' }} // Allow any file type
    />

    <Button type="submit" variant="contained" color="primary" fullWidth>
        POST
    </Button>
</Box>

        </Container>
    );
};

export default PostForm;
