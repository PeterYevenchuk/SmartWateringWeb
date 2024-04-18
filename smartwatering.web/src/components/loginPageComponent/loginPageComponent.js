import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../loginPageComponent/loginPageComponent.css';

const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const token2 = localStorage.getItem('refreshToken');
        if (token != null && token2 !== null){
            navigate('/home');
        }
        else{
            navigate('/');
        }
    });

    const handleLoginFormSubmit = () => {
        const formData = {
            email: email,
            password: password,
        };

        axios.post('https://localhost:44365/api/Auth/login', formData)
        .then(response => {
            const { accessToken, refreshToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            navigate('/home');
        })
        .catch (error => {
            setErrorMessage('Invalid credentials. Please check them and try again.');
            console.error('Error:', error);
        });
    };

    return (
        <div className='login-page'>
            <div className='login-box'>
                <span className='login-text'>Welcome, please login in your account</span>
                <div className='login-fields'>
                    <div className='email-field'>
                        <label className='email-label' htmlFor='email'>Email</label>
                        <input
                            className='email-input'
                            type='text'
                            id='email'
                            name='email'
                            placeholder='Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className='password-field'>
                        <label className='password-label' htmlFor='password'>Password</label>
                        <input
                            className='password-input'
                            type='password'
                            id='password'
                            name='password'
                            placeholder='Password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete='off'
                            required
                        />
                    </div>
                    {errorMessage && <div className='error-message'>{errorMessage}</div>}
                    <div className='login-confirm'>
                        <button className='login-button' onClick={handleLoginFormSubmit}>Log In</button>
                    </div>
                    <div className='register-link'>
                        <span>Don't have an account? </span>
                        <a href='/register'>Register</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
