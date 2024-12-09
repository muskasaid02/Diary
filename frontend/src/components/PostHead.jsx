import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import styles from '../styles/styles.module.scss';

const PostHead = ({ post }) => {
    const { dispatch } = usePostsContext();
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext);

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

    // Conditional styles
    const postStyle = {
        backgroundColor: theme === 'dark' ? '#555' : 'white',
        //color: theme === 'dark' ? 'white' : 'black',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        //boxShadow: theme === 'dark' ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: 'none',
        transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease', // Smooth transition for dark mode
    };

    const titleStyle = {
        color: theme === 'dark' ? '#bbdefb' : '#1565c0', // Light blue for dark mode, darker blue for light mode
        transition: 'color 0.3s ease', // Add smooth transition for title color
    };

    const dateAndContentStyle = {
        color: theme === 'dark' ? 'white' : 'black',
        transition: 'color 0.3s ease', // Add smooth transition for content color
    };

    return (
        <li style={postStyle}>
            <span className={styles.postHeadHeader}>
                <h2 style={titleStyle}>
                    <Link to={`/api/posts/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {post.title}
                    </Link>
                </h2>
                <span
                    className="material-symbols-outlined"
                    onClick={handleClick}
                    style={{ cursor: 'pointer', color: theme === 'dark' ? 'white' : 'black' }}
                >
                    delete
                </span>
            </span>
            <div style={dateAndContentStyle}>
                {format(new Date(post.date), 'MMMM d, y')}
            </div>
            <p style={dateAndContentStyle}>
                {post.content.substring(0, 200) + ' ...'}
            </p>
        </li>
    );
};

export default PostHead;