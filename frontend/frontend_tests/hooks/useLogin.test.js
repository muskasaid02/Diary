import { renderHook, act } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import { useLogin } from '../../src/hooks/useLogin';

describe('useLogin', () => {
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

    it('handles successful login', async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({
                email: 'test@example.com',
                token: 'test-token'
            })
        };
        global.fetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            await result.current.login('test@example.com', 'password123');
        });

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'LOGIN',
            payload: expect.any(Object)
        });
        expect(result.current.error).toBe(null);
        expect(result.current.isLoading).toBe(false);
    });

    it('handles login failure', async () => {
        const mockResponse = {
            ok: false,
            json: () => Promise.resolve({ error: 'Invalid credentials' })
        };
        global.fetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async () => {
            await result.current.login('test@example.com', 'wrongpassword');
        });

        expect(mockDispatch).not.toHaveBeenCalled();
        expect(result.current.error).toBe('Invalid credentials');
        expect(result.current.isLoading).toBe(false);
    });
});