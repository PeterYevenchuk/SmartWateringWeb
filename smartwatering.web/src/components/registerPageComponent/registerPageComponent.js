import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../registerPageComponent/registerPageComponent.css';

const RegisterPage = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [password, setPassword] = useState('');
    const [cityName, setCityName] = useState('');
    const navigate = useNavigate();

    const handleRegisterFormSubmit = () => {
        const formData = {
            name: name,
            surName: surName,
            email: email,
            password: password,
            cityName: cityName
        };

        axios.post('http://localhost:44365/api/User/create-user', formData)
        .then(response => {
            navigate('/');
        })
        .catch (error => {
            setErrorMessage('Invalid credentials. Please check them and try again.');
            console.error('Error:', error);
        });
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        if (newPassword.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
        } else {
            setErrorMessage(null);
        }
        setPassword(newPassword);
    };

    return (
        <div className='register-page'>
            <div className='register-box'>
                <span className='register-text'>Welcome, please register your account</span>
                <div className='register-fields'>
                    <div className='name-field'>
                        <label className='name-label' htmlFor='name'>Name</label>
                        <input
                            className='name-input'
                            type='text'
                            id='name'
                            name='name'
                            placeholder='Name'
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className='sur-name-field'>
                        <label className='sur-name-label' htmlFor='surName'>Sur Name</label>
                        <input
                            className='sur-name-input'
                            type='text'
                            id='sur-name'
                            name='sur-name'
                            placeholder='Sur Name'
                            value={surName}
                            onChange={e => setSurName(e.target.value)}
                            autoComplete='off'
                            required
                        />
                    </div>
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
                            onChange={handlePasswordChange}
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className='city-field'>
                        <label className='city-label' htmlFor='cityName'>City</label>
                        <input
                            className='city-input'
                            type='text'
                            id='city'
                            name='city'
                            placeholder='City'
                            value={cityName}
                            onChange={e => setCityName(e.target.value)}
                            autoComplete='off'
                            required
                        />
                    </div>
                    {errorMessage && <div className='error-message'>{errorMessage}</div>}
                    <div className='register-confirm'>
                        <button className='register-button' onClick={handleRegisterFormSubmit}>Save</button>
                    </div>
                    <div className='login-link'>
                        <span>Have an account? </span>
                        <a href='/'>Log In</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
