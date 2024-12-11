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

        
        expect(global.localStorage.getItem('user')).toBeNull();

        
        expect(mockAuthDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });

        
        expect(mockPostsDispatch).toHaveBeenCalledWith({ type: 'SET_POSTS', payload: null });
    });
});
