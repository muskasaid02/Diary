import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DiaryPost from '../../src/pages/DiaryPost';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: '123' })
}));

describe('DiaryPost', () => {
    const mockUser = { token: 'test-token' };
    const mockPost = {
        _id: '123',
        title: 'Test Post',
        content: 'Test content',
        date: '2024-12-08'
    };

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    const renderDiaryPost = () => {
        return render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<DiaryPost />} />
                    </Routes>
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it('loads and displays post', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockPost)
        });

        renderDiaryPost();

        await waitFor(() => {
            expect(screen.getByText(mockPost.title)).toBeInTheDocument();
            expect(screen.getByText(mockPost.content)).toBeInTheDocument();
            expect(screen.getByText(/December 8, 2024/)).toBeInTheDocument();
        });
    });

    it('handles loading state', () => {
        global.fetch.mockImplementation(() => new Promise(() => {}));
        renderDiaryPost();
        expect(screen.queryByText(mockPost.title)).not.toBeInTheDocument();
    });

    it('handles fetch error', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
        renderDiaryPost();
        
        await waitFor(() => {
            expect(screen.queryByText(mockPost.title)).not.toBeInTheDocument();
        });
    });
});