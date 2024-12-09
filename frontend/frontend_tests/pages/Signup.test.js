import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Signup from '../../src/pages/Signup';

// Mock the useSignup hook
jest.mock('../../hooks/useSignup', () => ({
    useSignup: () => ({
        signup: jest.fn(),
        error: null,
        isLoading: false
    })
}));

describe('Signup', () => {
    const renderSignup = () => {
        return render(
            <AuthContext.Provider value={{ user: null }}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it('renders signup form', () => {
        renderSignup();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('handles form submission', async () => {
        renderSignup();

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'Password123!' }
        });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            // Verify form submission behavior
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });
    });
});
