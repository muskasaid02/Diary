import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { PostsContextProvider } from './context/PostsContext';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';  // Import ThemeProvider, createTheme, CssBaseline
import './styles/index.scss';

// Create a Material UI theme
const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}> {/* Wrap the app with ThemeProvider */}
            <CssBaseline /> {/* Optional: Provides a consistent baseline style */}
            <AuthContextProvider>
                <PostsContextProvider>
                    <Router>
                        <App />
                    </Router>
                </PostsContextProvider>
            </AuthContextProvider>
        </ThemeProvider>
    </React.StrictMode>
);
