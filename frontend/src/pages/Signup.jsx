import { useForm } from "react-hook-form";
import { useSignup } from "../hooks/useSignup.js";
import {
    Container,
    Box,
    TextField,
    Typography,
    Button,
    Paper,
} from '@mui/material';

const Signup = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { signup, loading, error } = useSignup();

    const onSubmit = async data => {
        await signup(data.email, data.password);
        reset({ email: '', password: '' });
    };

    return (
        <Box
            sx={{
                //backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                width: '95vw',
                height: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Sign Up
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            {...register("email", { required: 'required field' })}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message : ""}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            {...register("password", { required: 'required field' })}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message : ""}
                            margin="normal"
                        />
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{ marginTop: 2 }}
                        >
                            Sign Up
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup;



