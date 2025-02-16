import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import MoodIcon from '@mui/icons-material/Mood';
import {
   ListItem,
   Typography,
   IconButton,
   Stack,
   Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditPostForm from './EditPostForm';

const PostHead = ({ post }) => {
   const { dispatch } = usePostsContext();
   const { user } = useAuthContext();
   const { theme } = useContext(ThemeContext);
   const [editDialogOpen, setEditDialogOpen] = useState(false);

   const handleClick = async () => {
       const response = await fetch(
           `https://diary-frontend-kba8.onrender.com/api/posts/${post._id}`,
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

   const postStyle = {
       backgroundColor: theme === 'dark' ? '#424242' : '#fff',
       color: theme === 'dark' ? '#fff' : '#000',
       padding: '1.5rem',
       borderRadius: '8px',
       boxShadow: theme === 'dark' ? '0px 4px 6px rgba(0,0,0,0.5)' : '0px 2px 4px rgba(0,0,0,0.1)',
       border: theme === 'dark' ? '1px solid #616161' : '1px solid #e0e0e0',
       transition: 'background-color 0.3s ease, color 0.3s ease',
       display: 'flex',
       flexDirection: 'column',
       height: '100%',
       minHeight: '200px'
   };

   const titleStyle = {
       color: theme === 'dark' ? '#bbdefb' : '#1565c0',
       textDecoration: 'none',
       fontWeight: 'bold',
       fontSize: '1.5rem',
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
       fontSize: '1rem',
       overflow: 'hidden',
       display: '-webkit-box',
       WebkitLineClamp: 3,
       WebkitBoxOrient: 'vertical',
       textOverflow: 'ellipsis',
       whiteSpace: 'normal',
       flex: 1
   };

   const moodStyle = {
    color: theme === 'dark' ? '#e0e0e0' : '#757575',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
};

   const handleEditClick = (e) => {
       e.stopPropagation();
       setEditDialogOpen(true);
   };

   return (
       <>
           <ListItem sx={postStyle}>
               <Stack
                   direction="column"
                   spacing={1}
                   sx={{ height: '100%' }}
               >
                   <Stack
                       direction="row"
                       justifyContent="space-between"
                       alignItems="center"
                   >
                       <Typography
                           component={Link}
                           to={`/api/posts/${post._id}`}
                           sx={titleStyle}
                       >
                           {post.title}
                       </Typography>

                       <Box sx={{ display: 'flex', gap: 1 }}>
                           <IconButton
                               onClick={handleEditClick}
                               sx={{
                                   color: theme === 'dark' ? '#90caf9' : '#1976d2',
                                   '&:hover': {
                                       backgroundColor: theme === 'dark'
                                           ? 'rgba(144, 202, 249, 0.2)'
                                           : 'rgba(25, 118, 210, 0.1)',
                                   },
                               }}
                           >
                               <EditIcon />
                           </IconButton>

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
                       </Box>
                   </Stack>

                   <Typography variant="body2" sx={dateStyle}>
                       {format(new Date(post.date), 'MMMM d, y')}
                   </Typography>

                                   {/* Mood Display */}
                <Box sx={moodStyle}>
                    <MoodIcon />
                    <span>{post.mood}</span>
                </Box>

                   <Typography
                       variant="body1"
                       sx={contentStyle}
                       dangerouslySetInnerHTML={{ __html: post.content }}
                   />
               </Stack>
           </ListItem>
           
           <EditPostForm 
               post={post}
               open={editDialogOpen}
               onClose={() => setEditDialogOpen(false)}
               theme={theme}
           />
       </>
   );
};

export default PostHead;