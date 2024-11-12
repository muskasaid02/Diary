import { useForm } from "react-hook-form";
import { useSignup } from "../hooks/useSignup.js";
import styles from '../styles/styles.module.scss';

const Signup = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { signup, loading, error } = useSignup();

    const onSubmit = async data => {
        await signup(data.email, data.password);
        reset({ email: '', password: '' });
    };

    return (
        // Background container for signup page
        <div 
            className={styles['login-container']}
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`, // Set the image path here
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                height: '95.5vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'translate(-2%, -3.8%)'

            }}
        >
            <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
                <h3> Sign Up </h3>
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
                <button 
                    className={styles.submit} 
                    type="submit"
                    disabled={loading}
                > 
                   Sign Up 
                </button>
                {error && <p>{ error }</p>}
            </form>
        </div>
    );
}

export default Signup;

