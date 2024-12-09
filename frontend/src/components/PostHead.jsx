import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
    ListItem,
    Typography,
    IconButton,
    Stack,
    Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PostHead = ({ post }) => {
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext);

    const handleClick = async () => {
        const response = await fetch(
            `https://diary-backend-utp0.onrender.com/api/posts/${post._id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );

        if (response.ok) {
            const json = await response.json();
            dispatch({ type: 'DELETE_POST', payload: post._id });
            console.log('Post deleted:', post._id);
        } else {
            console.error('Failed to delete post:', response.statusText);
        }
    };

    // Conditional styles based on the theme
    const postStyle = {
        backgroundColor: theme === 'dark' ? '#424242' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: theme === 'dark' ? '0px 4px 6px rgba(0,0,0,0.5)' : '0px 2px 4px rgba(0,0,0,0.1)',
        border: theme === 'dark' ? '1px solid #616161' : '1px solid #e0e0e0',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        width: '300px', // Set a fixed width for uniform size
        height: '200px', // Set a fixed height for uniform size
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Ensure proper spacing between title, date, and content
        position: 'relative', // Ensure no absolute/fixed positioning
    };

    const titleStyle = {
        color: theme === 'dark' ? '#bbdefb' : '#1565c0',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.5rem', // Slightly larger title size
        marginBottom: '0.5rem',
        '&:hover': {
            color: theme === 'dark' ? '#90caf9' : '#1a73e8',
        },
    };

    const dateStyle = {
        color: theme === 'dark' ? '#e0e0e0' : '#757575',
        fontSize: '0.875rem',
        marginBottom: '1rem',
    };

    const contentStyle = {
        color: theme === 'dark' ? '#f5f5f5' : '#212121',
        fontSize: '1rem', // Adjust content font size
        overflow: 'hidden', // Prevent content overflow
        textOverflow: 'ellipsis', // Add ellipsis for truncated content
        whiteSpace: 'nowrap', // Ensure single-line content if necessary
    };

    return (
        <ListItem sx={postStyle}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginBottom: '0.5rem' }}
            >
                <Typography
                    component={Link}
                    to={`/api/posts/${post._id}`}
                    sx={titleStyle}
                >
                    {post.title}
                </Typography>

                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    sx={{
                        color: theme === 'dark' ? '#e57373' : '#d32f2f',
                        '&:hover': {
                            backgroundColor: theme === 'dark'
                                ? 'rgba(229, 115, 115, 0.2)'
                                : 'rgba(211, 47, 47, 0.1)',
                        },
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Stack>

            <Typography variant="body2" sx={dateStyle}>
                {format(new Date(post.date), 'MMMM d, y')}
            </Typography>

            <Typography
                variant="body1"
                sx={contentStyle}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </ListItem>
    );
};

export default PostHead;
