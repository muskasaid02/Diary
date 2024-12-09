import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { PostsContext } from '../../context/PostsContext';
import Home from '../../src/pages/Home';

describe('Home', () => {
    const mockUser = { token: 'test-token' };
    const mockPosts = [
        { _id: '1', title: 'Post 1', content: 'Content 1', date: '2024-12-08' },
        { _id: '2', title: 'Post 2', content: 'Content 2', date: '2024-12-08' }
    ];

    const mockDispatch = jest.fn();

    beforeEach(() => {
        global.fetch = jest.fn();
        mockDispatch.mockClear();
    });

    const renderHome = (posts = null) => {
        return render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <PostsContext.Provider value={{ posts, dispatch: mockDispatch }}>
                    <BrowserRouter>
                        <Home />
                    </BrowserRouter>
                </PostsContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('displays loading spinner when posts is null', () => {
        renderHome(null);
        expect(screen.getByTestId('hash-loader')).toBeInTheDocument();
    });

    it('displays posts when loaded', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockPosts)
        });

        renderHome(mockPosts);

        expect(screen.getByText('Post 1')).toBeInTheDocument();
        expect(screen.getByText('Post 2')).toBeInTheDocument();
    });

    it('shows create post form', () => {
        renderHome([]);
        expect(screen.getByText('Create a post')).toBeInTheDocument();
    });
});