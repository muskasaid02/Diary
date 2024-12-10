import { useState } from 'react';
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

const EditPostForm = ({ post, open, onClose, theme }) => {
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [date, setDate] = useState(new Date(post.date).toISOString().split('T')[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting update:', { title, content, date });  // Debug log

        const response = await fetch(`https://diary-backend-utp0.onrender.com/api/posts/${post._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ title, content, date })
        });

        const json = await response.json();
        console.log('Server response:', json);  // Debug log

        if (response.ok) {
            console.log('Dispatching UPDATE_POST with:', json);  // Debug log
            dispatch({ type: 'UPDATE_POST', payload: json });
            onClose();
            console.log({type: 'Post Updated: ', payload: json});
        } else {
            console.error('Failed to update post:', response.statusText);
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
                    <TextField
                        fullWidth
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                        sx={{
                            '& .MuiInputBase-input': {
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                            '& .MuiInputLabel-root': {
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
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