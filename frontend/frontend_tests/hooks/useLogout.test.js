import { renderHook, act } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import { useLogout } from '../../src/hooks/useLogout';

describe('useLogout', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        localStorage.clear();
        mockDispatch.mockClear();
    });

    const wrapper = ({ children }) => (
        <AuthContext.Provider value={{ dispatch: mockDispatch }}>
            {children}
        </AuthContext.Provider>
    );

    it('handles logout correctly', () => {
        // Set some initial data in localStorage
        localStorage.setItem('user', JSON.stringify({ email: 'test@example.com', token: 'test-token' }));

        const { result } = renderHook(() => useLogout(), { wrapper });

        act(() => {
            result.current.logout();
        });

        expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });
        expect(localStorage.getItem('user')).toBeNull();
    });
});