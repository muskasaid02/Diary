import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin.js";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import useStyles from "../styles/makeStyles";

const Login = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { login, loading, error } = useLogin();
    const { theme } = useContext(ThemeContext); // Use `theme` from ThemeContext
    console.log("Theme:", theme); // Debugging log to check theme value
    const classes = useStyles();

    const onSubmit = async data => {
        await login(data.email, data.password);
        reset({ email: "", password: "" });
    };

    return (
        <Box
            sx={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                width: "95vw",
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={3}
                    className={`${classes.paper} ${theme === "dark" ? classes.paperDark : classes.paperLight
                        }`}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography
                            variant="h5"
                            component="h3"
                            gutterBottom
                            className={`${classes.heading} ${theme === "dark" ? classes.headingDark : ""
                                }`}
                        >
                            Log In
                        </Typography>

                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            {...register("email", { required: "required field" })}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message : ""}
                            autoComplete="off"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            {...register("password", { required: "required field" })}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message : ""}
                        />

                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                Login
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
