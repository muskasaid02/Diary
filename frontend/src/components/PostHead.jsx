import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import styles from '../styles/styles.module.scss';

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
        <li>
            <span className={styles.postHeadHeader}>
                <h2>
                    <Link to={`/api/posts/${post._id}`}>{ post.title }</Link>
                </h2>
                <span 
                    className="material-symbols-outlined"
                    onClick={handleClick}
                >
                    delete
                </span>
            </span>
            <div>{ format(new Date(post.date), 'MMMM d, y') }</div>
            <p>{ post.content.substring(0, 200) + ' ...' }</p>
        </li>
    );
};

export default PostHead;