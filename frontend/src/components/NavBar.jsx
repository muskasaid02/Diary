import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout.js';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const NavBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const handleClick = () => logout();

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 3 }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '48px !important',  // Reduced height
                    px: 2  // Add some horizontal padding
                }}>
                    {/* Left: Home link */}
                    <Typography variant="h6" component="div">
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Home
                        </Link>
                    </Typography>

                    {/* Center: App Title */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                        The Diary App
                    </Typography>

                    {/* Right: Auth Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {user ? (
                            <>
                                <Typography variant="body1">
                                    {user.email}
                                </Typography>
                                <Button 
                                    color="inherit" 
                                    onClick={handleClick}
                                    sx={{ ml: 2 }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/api/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={Link} to="/api/signup">
                                    Signup
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavBar;