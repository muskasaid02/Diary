import { render, act } from '@testing-library/react';
import { useContext } from 'react';
import { AuthContext, AuthContextProvider } from '../../src/context/AuthContext';

describe('AuthContext', () => {
    let TestComponent; // Use PascalCase for React component naming
    let renderedContext;

    beforeEach(() => {
        TestComponent = function TestComponent() {
            renderedContext = useContext(AuthContext);
            return null;
        };
    });

    it('provides initial auth state', () => {
        render(
            <AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>
        );

        // Check initial state provided by AuthContextProvider
        expect(renderedContext.user).toBe(null);
        expect(typeof renderedContext.dispatch).toBe('function');
    });

    it('updates auth state on login action', () => {
        render(
            <AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>
        );

        act(() => {
            // Dispatch a LOGIN action
            renderedContext.dispatch({
                type: 'LOGIN',
                payload: { email: 'test@example.com', token: 'test-token' }
            });
        });

        // Check updated state after LOGIN action
        expect(renderedContext.user).toEqual({
            email: 'test@example.com',
            token: 'test-token'
        });
    });

    it('clears auth state on logout action', () => {
        render(
            <AuthContextProvider>
                <TestComponent />
            </AuthContextProvider>
        );

        act(() => {
            // Dispatch a LOGOUT action
            renderedContext.dispatch({ type: 'LOGOUT' });
        });

        // Check state after LOGOUT action
        expect(renderedContext.user).toBe(null);
    });
});
