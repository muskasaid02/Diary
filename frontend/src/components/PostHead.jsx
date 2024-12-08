import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { 
  ListItem, 
  Typography, 
  IconButton,  
  Stack 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PostHead = ({ post }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    const response = await fetch(`https://diary-backend-utp0.onrender.com/api/posts/${post._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (response.ok) {
      const json = await response.json();
      dispatch({ type: 'DELETE_POST', payload: post._id });
      console.log('Post deleted:', post._id);
    } else {
      console.error('Failed to delete post:', response.statusText);
    }
  };

  return (
    <ListItem 
      sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '1.5rem',
        borderBottom: '1px solid #e0e0e0',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ marginBottom: '0.5rem' }}
      >
        <Typography 
          component={Link} 
          to={`/api/posts/${post._id}`}
          sx={{
            textDecoration: 'none',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            '&:hover': {
              color: '#1a73e8'
            }
          }}
        >
          {post.title}
        </Typography>
        
        <IconButton 
          onClick={handleClick}
          sx={{
            color: '#d32f2f',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.1)'
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ marginBottom: '1rem' }}
      >
        {format(new Date(post.date), 'MMMM d, y')}
      </Typography>
      
      <Typography variant="body1">
        {post.content.substring(0, 200) + ' ...'}
      </Typography>
    </ListItem>
  );
};

export default PostHead;