import { renderHook, act } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import { useSignup } from '../../src/hooks/useSignup';

describe('useSignup', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        global.fetch = jest.fn();
        localStorage.clear();
        mockDispatch.mockClear();
    });

    const wrapper = ({ children }) => (
        <AuthContext.Provider value={{ dispatch: mockDispatch }}>
            {children}
        </AuthContext.Provider>
    );

    it('handles successful signup', async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({
                email: 'test@example.com',
                token: 'test-token'
            })
        };
        global.fetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useSignup(), { wrapper });

        await act(async () => {
            await result.current.signup('test@example.com', 'Password123!');
        });

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'LOGIN',
            payload: expect.any(Object)
        });
        expect(result.current.error).toBe(null);
        expect(result.current.isLoading).toBe(false);
    });

    it('handles signup failure', async () => {
        const mockResponse = {
            ok: false,
            json: () => Promise.resolve({ error: 'Email already exists' })
        };
        global.fetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useSignup(), { wrapper });

        await act(async () => {
            await result.current.signup('test@example.com', 'Password123!');
        });

        expect(mockDispatch).not.toHaveBeenCalled();
        expect(result.current.error).toBe('Email already exists');
        expect(result.current.isLoading).toBe(false);
    });

    it('validates password strength', async () => {
        const { result } = renderHook(() => useSignup(), { wrapper });

        await act(async () => {
            await result.current.signup('test@example.com', 'weak');
        });

        expect(result.current.error).toBeTruthy();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('validates email format', async () => {
        const { result } = renderHook(() => useSignup(), { wrapper });

        await act(async () => {
            await result.current.signup('invalid-email', 'Password123!');
        });

        expect(result.current.error).toBeTruthy();
        expect(mockDispatch).not.toHaveBeenCalled();
    });
});