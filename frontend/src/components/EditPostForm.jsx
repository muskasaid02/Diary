import React, { useState } from 'react';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Include Quill styles

const EditPostForm = ({ post, open, onClose, theme }) => {
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    
    // State variables for post fields
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content); // Save HTML directly
    const [date, setDate] = useState(new Date(post.date).toISOString().split('T')[0]);

    // Handle form submission to update the post
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedPost = {
            title,
            content, // Save HTML content directly
            date,
        };

        try {
            const response = await fetch(`http://localhost:4000/api/posts/${post._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(updatedPost),
            });

            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'UPDATE_POST', payload: json });
                onClose();
            } else {
                console.error('Failed to update post:', json);
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: theme === 'dark' ? '#424242' : '#fff',
                    color: theme === 'dark' ? '#fff' : '#000',
                }
            }}
        >
            <DialogTitle>Edit Post</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                    {/* Title Field */}
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        sx={{
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                            '& .MuiInputLabel-root': {
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                        }}
                    />

                    {/* Date Field */}
                    <TextField
                        type="date"
                        fullWidth
                        label="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                            '& .MuiInputLabel-root': {
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                        }}
                    />

                    {/* Content Editor (ReactQuill) */}
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={(value) => setContent(value)} // Save HTML content directly
                        style={{
                            backgroundColor: '#fff', // Always white background
                            color: theme === 'dark' ? '#000' : '#000', // Black text for readability
                            border: theme === 'dark' ? '1px solid #6c757d' : '1px solid #ccc', // Match border style
                            borderRadius: '4px', // Same border radius as TextField
                            minHeight: '150px', // Ensure a consistent height
                            padding: '10px', // Add padding for readability
                        }}
                        modules={{
                            toolbar: [
                                [{ header: '1' }, { header: '2' }, { font: [] }],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['bold', 'italic', 'underline', 'strike'],
                                ['link', 'image'],
                                ['clean'],
                            ],
                        }}
                        formats={[
                            'header',
                            'font',
                            'list',
                            'bold',
                            'italic',
                            'underline',
                            'strike',
                            'link',
                            'image',
                        ]}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPostForm;
