import { useForm } from 'react-hook-form';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const PostForm = () => {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext); // Access theme

    const onSubmit = async data => {
        const post = {
            date: data.date,
            title: data.title,
            content: data.content,
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

            const body = await response.text();
            const newPost = JSON.parse(body);

            if (!response.ok) {
                setError('something went wrong', { type: 400 });
            }

            if (response.ok) {
                reset({ title: '', date: '', content: '', password: '' });
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
                    boxShadow: theme === 'dark' ? 3 : '0px 0px 8px rgba(0, 0, 0, 0.2)', // Outline
                    borderRadius: 2,
                    backgroundColor: theme === 'dark' ? '#555' : 'white',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Add smooth transition
                }}
            >
                <Typography
                    variant="h5"
                    align="center"
                    gutterBottom
                    sx={{
                        color: theme === 'dark' ? 'white' : 'black',
                        transition: 'color 0.3s ease', // Add smooth transition for text color
                    }}
                >
                    Create a post
                </Typography>

                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue in dark mode
                            transition: 'color 0.3s ease',
                        },
                    }}
                    inputProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue text
                        },
                    }}
                    FormHelperTextProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue helper text
                        },
                    }}
                    {...register("title", { required: 'Title is required' })}
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
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue text
                        },
                    }}
                    FormHelperTextProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue helper text
                        },
                    }}
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
                    InputLabelProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue in dark mode
                        },
                    }}
                    inputProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue text
                        },
                    }}
                    {...register("content", { required: 'Content is required' })}
                    error={!!errors.content}
                    helperText={errors.content?.message}
                    sx={{
                        backgroundColor: theme === 'dark' ? '#fff' : 'inherit', // Content box remains white
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
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue text
                        },
                    }}
                    FormHelperTextProps={{
                        style: {
                            color: theme === 'dark' ? '#1E88E5' : 'black', // Blue helper text
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
