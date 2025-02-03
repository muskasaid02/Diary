import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import DrawingCanvas from '../components/DrawingCanvas';
import { Box, Button, Container, MenuItem, TextField, Typography, Select, InputLabel, FormControl } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ThemeContext } from '../context/ThemeContext';

// Full toolbar configuration for ReactQuill
const editorModules = {
  toolbar: [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],  // Rich text options
    [{ 'header': 1 }, { 'header': 2 }],         // Header options
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],  // Add image and video options
    ['clean']                    // Clear formatting option
  ],
};

const editorFormats = [
  'font', 'bold', 'italic', 'underline', 'strike', 
  'header', 'list', 'bullet', 'align', 
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
  const [drawing, setDrawing] = useState(null);  // Store base64 drawing here

  const onSubmit = async (data) => {
    const post = {
      date: data.date,
      title: data.title,
      content: content,
      mood: mood,
      password: data.password || null,
      drawing: drawing,  // Include the drawing in the payload
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

      const json = await response.json();
      if (response.ok) {
        reset({ title: '', date: '', password: '' });
        setContent('');
        setMood('Neutral');
        setDrawing(null);  // Clear the drawing
        dispatch({ type: 'CREATE_POST', payload: json });
      } else {
        setError('submit', { message: json.error || 'An error occurred.' });
      }
    } catch (err) {
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
          padding: '20px',
          boxShadow: theme === 'dark' ? '0px 4px 6px rgba(0, 0, 0, 0.5)' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
          borderRadius: 2,
          backgroundColor: theme === 'dark' ? '#424242' : '#fff',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
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
        />

        <TextField
          label="Date"
          type="date"
          variant="outlined"
          fullWidth
          {...register('date', { required: 'Date is required' })}
          error={!!errors.date}
          helperText={errors.date?.message}
          InputLabelProps={{ shrink: true }}
        />

        {/* ReactQuill with full toolbar and dynamic dark mode styles */}
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={editorModules}
          formats={editorFormats}
          style={{
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
            minHeight: '150px',
            border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc',
          }}
        />

        <FormControl fullWidth>
          <InputLabel>Mood</InputLabel>
          <Select value={mood} onChange={(e) => setMood(e.target.value)}>
            <MenuItem value="Happy">Happy</MenuItem>
            <MenuItem value="Sad">Sad</MenuItem>
            <MenuItem value="Excited">Excited</MenuItem>
            <MenuItem value="Anxious">Anxious</MenuItem>
            <MenuItem value="Neutral">Neutral</MenuItem>
          </Select>
        </FormControl>

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

        {/* Drawing Component */}
        <DrawingCanvas onSave={(imageData) => setDrawing(imageData)} />

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
