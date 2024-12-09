import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../src/context/AuthContext';
import Layout from '../../src/pages/Layout';

describe('Layout', () => {
    it('renders navbar and outlet', () => {
        render(
            <AuthContext.Provider value={{ user: null }}>
                <BrowserRouter>
                    <Layout />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        expect(screen.getByText('The Diary App')).toBeInTheDocument();
        // Test for other layout elements
    });
});