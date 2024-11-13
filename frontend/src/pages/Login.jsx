import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin.js";
import styles from '../styles/styles.module.scss';

const Login = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { login, loading, error } = useLogin();

    const onSubmit = async data => {
        await login(data.email, data.password);
        reset({ email: '', password: '' });
    };

    return (
        <div 
            className={styles['login-container']}
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                width: '100vw',       
                height: '100vh',      
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'translateX(-2%)translateY(3.2%)',
                
            }}
        >
            <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
                <h3 style={{ marginBottom: '0.5rem' }}> Log In </h3>
                <input 
                    type="email" 
                    {...register("email", { required: 'required field' })}
                    placeholder="email"
                    autoComplete="off"
                />
                <p>{ errors.email?.message }</p>
                <input 
                    type="password" 
                    {...register("password", { required: 'required field' })}
                    placeholder="password"
                />
                <p>{ errors.password?.message }</p>
                {error && <div>{ error }</div>}

                
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '50%',
                        transform: 'translateX(117%)translateY(200%)',
                    }}
                >
                    <button 
                        className={styles.submit} 
                        type="submit"
                        disabled={loading}
                    > 
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
