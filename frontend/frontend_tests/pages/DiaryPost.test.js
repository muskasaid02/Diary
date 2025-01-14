// frontend/frontend_tests/pages/DiaryPost.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../src/context/AuthContext';
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
        global.fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockPost)
            })
        );

        renderDiaryPost();

        await waitFor(() => {
            expect(screen.getByText(mockPost.title)).toBeInTheDocument();
        });
    });

    it('handles loading state', () => {
        global.fetch.mockImplementationOnce(() => new Promise(() => {}));
        renderDiaryPost();
        expect(screen.queryByText(mockPost.title)).not.toBeInTheDocument();
    });

    it('handles fetch error', async () => {
        global.fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: false,
                status: 404,
                json: () => Promise.resolve({ error: 'Post not found' })
            })
        );

        renderDiaryPost();
        
        await waitFor(() => {
            expect(screen.queryByText(mockPost.title)).not.toBeInTheDocument();
        });
    });
});