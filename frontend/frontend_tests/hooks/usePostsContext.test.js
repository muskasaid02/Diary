import { renderHook } from '@testing-library/react';
import { PostsContext } from '../../src/context/PostsContext';
import { usePostsContext } from '../../src/hooks/usePostsContext';

describe('usePostsContext', () => {
    it('returns posts context values', () => {
        const mockPosts = [{ id: 1, title: 'Test Post' }];
        const mockDispatch = jest.fn();

        const wrapper = ({ children }) => (
            <PostsContext.Provider value={{ posts: mockPosts, dispatch: mockDispatch }}>
                {children}
            </PostsContext.Provider>
        );

        const { result } = renderHook(() => usePostsContext(), { wrapper });

        expect(result.current.posts).toEqual(mockPosts);
        expect(result.current.dispatch).toBe(mockDispatch);
    });

    it('throws error when used outside PostsContext', () => {
        expect(() => {
            renderHook(() => usePostsContext());
        }).toThrow('usePostsContext must be used inside a PostsContext Provder');
    });
});
