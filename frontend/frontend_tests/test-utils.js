// frontend_tests/test-utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../src/context/AuthContext';
import { PostsContext } from '../src/context/PostsContext';

export const mockUser = { email: 'test@example.com', token: 'test-token' };
export const mockDispatch = jest.fn();

export const renderWithProviders = (ui, {
    user = mockUser,
    posts = null,
    dispatch = mockDispatch,
    ...renderOptions
} = {}) => {
    const Wrapper = ({ children }) => (
        <AuthContext.Provider value={{ user, dispatch }}>
            <PostsContext.Provider value={{ posts, dispatch }}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </PostsContext.Provider>
        </AuthContext.Provider>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};