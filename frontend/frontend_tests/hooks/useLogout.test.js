import { renderHook, act } from '@testing-library/react';
import { AuthContext } from '../../src/context/AuthContext';
import { PostsContext } from '../../src/context/PostsContext';
import { useLogout } from '../../src/hooks/useLogout';

describe('useLogout', () => {
    const mockAuthDispatch = jest.fn();
    const mockPostsDispatch = jest.fn();

    beforeEach(() => {
        global.localStorage.setItem(
            'user',
            JSON.stringify({ email: 'test@example.com', token: 'test-token' })
        );
        mockAuthDispatch.mockClear();
        mockPostsDispatch.mockClear();
    });

    const wrapper = ({ children }) => (
        <AuthContext.Provider value={{ dispatch: mockAuthDispatch }}>
            <PostsContext.Provider value={{ dispatch: mockPostsDispatch }}>
                {children}
            </PostsContext.Provider>
        </AuthContext.Provider>
    );

    it('handles logout correctly', () => {
        const { result } = renderHook(() => useLogout(), { wrapper });

        act(() => {
            result.current.logout();
        });

        // Assert that user is removed from local storage
        expect(global.localStorage.getItem('user')).toBeNull();

        // Assert that AuthContext dispatch was called with LOGOUT
        expect(mockAuthDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });

        // Assert that PostsContext dispatch was called with SET_POSTS and payload null
        expect(mockPostsDispatch).toHaveBeenCalledWith({ type: 'SET_POSTS', payload: null });
    });
});
