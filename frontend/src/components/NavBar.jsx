import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout.js';
import { useContext } from 'react'; // Import useContext
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FaSun, FaMoon } from 'react-icons/fa'; // Optional: For sun/moon icons

const NavBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const { theme, toggleTheme } = useContext(ThemeContext); // Access theme and toggle function

    const handleClick = () => logout();

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2', paddingY: 1 }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ minHeight: '20% !important', display: 'flex', justifyContent: 'space-between' }}>

                    {/*Home*/}
                    <Box sx={{ display: 'flex', justifyContent: 'left', flex: 1 }}>
                        <Typography variant="h6" component="div">
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                Home
                            </Link>
                        </Typography>
                    </Box>

                    {/*Title*/}
                    <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                        <Typography variant="h6" component="div">
                            The Diary App
                        </Typography>
                    </Box>

                    {/*Login/Signup and Theme Toggle*/}
                    <Box sx={{ display: 'flex', justifyContent: 'right', flex: 1 }}>
                        <Button color="inherit" onClick={toggleTheme}>
                            {theme === 'light' ? <FaMoon /> : <FaSun />} {/* Show Sun/Moon icon based on the theme */}
                        </Button>

                        {user ? (
                            <>
                                <Typography variant="body1" sx={{ marginRight: 2 }}>
                                    {user.email}
                                </Typography>
                                <Button color="inherit" onClick={handleClick}>
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
