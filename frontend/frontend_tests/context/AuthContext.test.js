import { render, act } from '@testing-library/react';
import { useContext } from 'react';
import { AuthContext, AuthContextProvider } from '../../src/context/AuthContext';

describe('AuthContext', () => {
    let testComponent;
    let renderedContext;

    beforeEach(() => {
        testComponent = function TestComponent() {
            renderedContext = useContext(AuthContext);
            return null;
        };
    });

    it('provides initial auth state', () => {
        render(
            <AuthContextProvider>
                <testComponent />
            </AuthContextProvider>
        );

        expect(renderedContext.user).toBe(null);
        expect(typeof renderedContext.dispatch).toBe('function');
    });

    it('updates auth state on login action', () => {
        render(
            <AuthContextProvider>
                <testComponent />
            </AuthContextProvider>
        );

        act(() => {
            renderedContext.dispatch({
                type: 'LOGIN',
                payload: { email: 'test@example.com', token: 'test-token' }
            });
        });

        expect(renderedContext.user).toEqual({
            email: 'test@example.com',
            token: 'test-token'
        });
    });

    it('clears auth state on logout action', () => {
        render(
            <AuthContextProvider>
                <testComponent />
            </AuthContextProvider>
        );

        act(() => {
            renderedContext.dispatch({ type: 'LOGOUT' });
        });

        expect(renderedContext.user).toBe(null);
    });
});