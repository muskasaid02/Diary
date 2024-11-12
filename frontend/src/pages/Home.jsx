import { useEffect } from 'react';
import { HashLoader } from 'react-spinners';
import { usePostsContext } from '../hooks/usePostsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import PostHead from '../components/PostHead';
import PostForm from '../components/PostForm';
import styles from '../styles/styles.module.scss';

const Home = () => {
    const { posts, dispatch } = usePostsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('https://diary-backend-utp0.onrender.com/api/posts', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) dispatch({ type: 'SET_POSTS', payload: json });
        }

        if (user) fetchPosts();
    }, [user, dispatch]);

    if (!posts) {
        return (
            <div className="spinner">
                <HashLoader
                    color="#36d7b7"
                    size={200}
                />
            </div>
        );
    }

    return (
        <>
            <div>
                <h1> Posts </h1>

                <div className={styles.postContainer}>
                    {posts && posts.map(post => (
                        <div key={post._id} className={styles.postCard}>
                            <PostHead post={post} />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <PostForm />
            </div>
        </>
    );
};

export default Home;
