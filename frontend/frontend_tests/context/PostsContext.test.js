import { render, act } from '@testing-library/react';
import { useContext } from 'react';
import { PostsContext, PostsContextProvider } from '../../src/context/PostsContext';

describe('PostsContext', () => {
    let testComponent;
    let renderedContext;

    beforeEach(() => {
        testComponent = function TestComponent() {
            renderedContext = useContext(PostsContext);
            return null;
        };
    });

    it('provides initial posts state', () => {
        render(
            <PostsContextProvider>
                <testComponent />
            </PostsContextProvider>
        );

        expect(renderedContext.posts).toBe(null);
        expect(typeof renderedContext.dispatch).toBe('function');
    });

    it('updates posts on SET_POSTS action', () => {
        const testPosts = [
            { _id: '1', title: 'Test 1' },
            { _id: '2', title: 'Test 2' }
        ];

        render(
            <PostsContextProvider>
                <testComponent />
            </PostsContextProvider>
        );

        act(() => {
            renderedContext.dispatch({
                type: 'SET_POSTS',
                payload: testPosts
            });
        });

        expect(renderedContext.posts).toEqual(testPosts);
    });

    it('handles CREATE_POST action', () => {
        const newPost = { _id: '3', title: 'New Post' };

        render(
            <PostsContextProvider>
                <testComponent />
            </PostsContextProvider>
        );

        act(() => {
            renderedContext.dispatch({
                type: 'CREATE_POST',
                payload: newPost
            });
        });

        expect(renderedContext.posts).toContainEqual(newPost);
    });

    it('handles DELETE_POST action', () => {
        const initialPosts = [
            { _id: '1', title: 'Test 1' },
            { _id: '2', title: 'Test 2' }
        ];

        render(
            <PostsContextProvider>
                <testComponent />
            </PostsContextProvider>
        );

        act(() => {
            renderedContext.dispatch({
                type: 'SET_POSTS',
                payload: initialPosts
            });
        });

        act(() => {
            renderedContext.dispatch({
                type: 'DELETE_POST',
                payload: '1'
            });
        });

        expect(renderedContext.posts).toHaveLength(1);
        expect(renderedContext.posts[0]._id).toBe('2');
    });
});