import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { format } from 'date-fns';
import styles from '../styles/styles.module.scss';

const DiaryPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchPost = async () => {
            const headers = {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            };

            const body = password ? JSON.stringify({ password }) : null;

            try {
                const response = await fetch(`https://diary-backend-utp0.onrender.com/${id}`, {
                    method: body ? 'POST' : 'GET',
                    headers,
                    body
                });

                if (response.status === 401) {
                    setPasswordRequired(true);
                    setError('Password is required to access this post.');
                } else {
                    const json = await response.json();
                    if (response.ok) {
                        setPost(json);
                        setPasswordRequired(false);
                        setError(null);
                    } else {
                        setError(json.error || 'Failed to load the post');
                    }
                }
            } catch (err) {
                setError('An error occurred. Please try again later.');
            }
        };

        if (user) fetchPost();
    }, [user, id, password]);

    if (!post && !passwordRequired) return null;

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordRequired(false); 
    };

    return (
        <div className={styles.diaryPost}>
            {passwordRequired ? (
                <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Submit</button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            ) : (
                <>
                    {error && <p className={styles.error}>{error}</p>}
                    {post && (
                        <>
                            <h2>{post.title}</h2>
                            <div>{format(new Date(post.date), 'MMMM d, y')}</div>
                            <p>{post.content}</p>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default DiaryPost;
