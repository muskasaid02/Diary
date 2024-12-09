// frontend_tests/context/PostsContext.test.js
import React from 'react';
import { render, act } from '@testing-library/react';
import { PostsContext, PostsContextProvider } from '../../src/context/PostsContext';

describe('PostsContext', () => {
    let TestComponent;
    let renderedContext;

    beforeEach(() => {
        renderedContext = undefined;
        TestComponent = () => {
            const context = React.useContext(PostsContext);
            renderedContext = context;
            return null;
        };
    });

    it('provides initial posts state', () => {
        render(
            <PostsContextProvider>
                <TestComponent />
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
                <TestComponent />
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
});