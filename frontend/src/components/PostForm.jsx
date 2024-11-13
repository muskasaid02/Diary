import { useForm } from 'react-hook-form';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const PostForm = () => {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();

    const onSubmit = async data => {
        const post = {
            date: data.date,
            title: data.title,
            content: data.content
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

            const body = await response.text();
            const newPost = JSON.parse(body);

            if (!response.ok) setError('something went wrong', { type: 400 });

            if (response.ok) {
                reset({ title: '', date: '', content: '' });
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
                
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    POST
                </Button>
            </Box>
        </Container>
    );
};

export default PostForm;
