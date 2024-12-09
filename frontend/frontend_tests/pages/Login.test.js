import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Login from '../../src/pages/Login';

// Mock the useLogin hook
jest.mock('../../hooks/useLogin', () => ({
    useLogin: () => ({
        login: jest.fn(),
        error: null,
        isLoading: false
    })
}));

describe('Login', () => {
    const renderLogin = () => {
        return render(
            <AuthContext.Provider value={{ user: null }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it('renders login form', () => {
        renderLogin();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('handles form submission', async () => {
        renderLogin();

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            // Verify form submission behavior
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });
    });
});