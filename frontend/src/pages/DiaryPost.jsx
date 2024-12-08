import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { format } from 'date-fns';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography
} from '@mui/material';

const DiaryPost = () => {
  const { id } = useParams();
  const [ post, setPost ] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`https://diary-backend-utp0.onrender.com/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();
      if (response.ok) setPost(json);
    };
    if (user) fetchPost();
  }, [user, id]);

  if (!post) return null;

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 0'
      }}
    >
      <Card 
        sx={{
          maxWidth: 800,
          backgroundColor: '#c41313',
          borderRadius: '8px',
          padding: '2rem'
        }}
      >
        <CardContent>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}
          >
            {post.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ marginBottom: '1rem' }}
          >
            {format(new Date(post.date), 'MMMM d, y')}
          </Typography>
          <Typography variant="body1">
            {post.content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DiaryPost;