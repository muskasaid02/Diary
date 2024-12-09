import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { PostsContextProvider } from './context/PostsContext';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';  // Import the ThemeProvider from your ThemeContext
import './styles/index.css';  // Update the path to point to the styles folder

// Create a Material UI theme
const muiTheme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <ThemeProvider> {/* Wrap with your custom ThemeProvider */}
            <MUIThemeProvider theme={muiTheme}> {/* Apply the Material UI theme */}
                <CssBaseline /> {/* Optional: Provides a consistent baseline style */}
                <AuthContextProvider>
                    <PostsContextProvider>
                        <Router>
                            <App />
                        </Router>
                    </PostsContextProvider>
                </AuthContextProvider>
            </MUIThemeProvider>
        </ThemeProvider>
    </React.StrictMode>
);