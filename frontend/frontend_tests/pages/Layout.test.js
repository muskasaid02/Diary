import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../src/context/AuthContext';
import { PostsContext } from '../../src/context/PostsContext';
import Layout from '../../src/pages/Layout';

describe('Layout', () => {
    it('renders navbar and outlet', () => {
        const mockPosts = [];
        const mockDispatch = jest.fn();

        render(
            <AuthContext.Provider value={{ user: null }}>
                <PostsContext.Provider value={{ posts: mockPosts, dispatch: mockDispatch }}>
                    <BrowserRouter>
                        <Layout />
                    </BrowserRouter>
                </PostsContext.Provider>
            </AuthContext.Provider>
        );

        expect(screen.getByText('The Diary App')).toBeInTheDocument();
    });
});
