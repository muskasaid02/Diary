import { renderHook } from '@testing-library/react';
import { AuthContext } from '../../src/context/AuthContext';
import { useAuthContext } from '../../src/hooks/useAuthContext';

describe('useAuthContext', () => {
    it('returns auth context values', () => {
        const wrapper = ({ children }) => (
            <AuthContext.Provider value={{ user: { email: 'test@example.com' }, dispatch: jest.fn() }}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuthContext(), { wrapper });

        expect(result.current.user).toEqual({ email: 'test@example.com' });
        expect(typeof result.current.dispatch).toBe('function');
    });

    it('throws error when used outside AuthContext', () => {
        const { result } = renderHook(() => useAuthContext());
        
        expect(result.error).toBeTruthy();
    });
});