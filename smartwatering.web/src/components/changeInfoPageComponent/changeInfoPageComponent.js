import NavigatorMenu from '../navigatorComponent/navigatorComponent.js';
import React, { useState } from 'react';
import axios from 'axios';
import '../changeInfoPageComponent/changeInfoPageComponent.css';
import {jwtDecode} from 'jwt-decode';
import Auth from '../AuthComponent/authComponent.js'

const ChangeInfo = () => {
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [cityName, setCityName] = useState('');
    const [error, setError] = useState(false);
    const [errorCity, setErrorCity] = useState(false);
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [infoBoxText, setInfoBoxText] = useState('');
    const accessToken = Auth();
    const decodeToken = jwtDecode(accessToken);
    const userId = decodeToken.nameid;

    const handleInfoSave = () => {
        const userInfo = {
            id: userId,
            name: name || null,
            surName: surName || null,
            email: email || null,
            password: password || null,
            oldPassword: oldPassword || null
        };

        axios.patch('https://localhost:44365/api/User/change-user-info', userInfo, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            })
            .then(response => {
                setError(false);
                setShowInfoBox(true);
                setInfoBoxText('User info changed successfully!');
            })
            .catch(error => {
                setError(true);
                setShowInfoBox(true);
                setInfoBoxText('Error changing user info.');
                console.error('Error changing user info:', error);
            });
    };

    const handleCitySave = () => {
        const userInfo = {
            userId: userId,
            cityName: cityName
        };

        axios.patch('https://localhost:44365/api/User/change-user-city', userInfo, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            })
            .then(response => {
                setErrorCity(false);
                setShowInfoBox(true);
                setInfoBoxText('City changed successfully!');
            })
            .catch(error => {
                setErrorCity(true);
                setShowInfoBox(true);
                setInfoBoxText('Error changing city.');
                console.error('Error changing city:', error);
            });
    };

    const handleBoxClose = () => {
        setShowInfoBox(false);
    };

    return (
        <div>
            <NavigatorMenu />
            <div className='change-info-container'>
                <div className='informationMessage'>
                    <span>!!! You can change only the values you need, and leave the ones you don't need to change empty.</span>
                </div>
                <div className='generalChangeInfo'>
                    <span className='changeInfoMessage'>Change your information.</span>
                    <div className='row1'>
                        <input className={error ? 'error' : ''} type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
                        <input className={error ? 'error' : ''} type='text' placeholder='Surname' value={surName} onChange={e => setSurName(e.target.value)} />
                        <input className={error ? 'error' : ''} type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <span className='changeInfoMessage'>Change your old password to a new one.</span>
                    <div className='row2'>
                        <input className={error ? 'error' : ''} type='password' placeholder='New Password' value={password} onChange={e => setPassword(e.target.value)} />
                        <input className={error ? 'error' : ''} type='password' placeholder='Old Password' value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                        <button className='saveInfo' onClick={handleInfoSave}>Save</button>
                    </div>
                </div>
                <div className='cityChangeInfo'>
                    <span className='changeInfoMessage'>Change the location of your soil moisture sensor and sprayer.</span>
                    <div className='row3'>
                        <input className={errorCity ? 'error' : ''} type='text' placeholder='City' value={cityName} onChange={e => setCityName(e.target.value)}/>
                        <button className='saveInfo' onClick={handleCitySave}>Save</button>
                    </div>
                </div>
            </div>
            {showInfoBox === true &&
            <div className='message'>
                {showInfoBox && <MessageBox text={infoBoxText} onClose={handleBoxClose} />}
            </div>}
        </div>
    );
};

const MessageBox = ({ text, onClose }) => {
    return (
        <div className='message-box'>
            <div className='message-text'>{text}</div>
            <button className='ok-button' onClick={onClose}>OK</button>
        </div>
    );
};

export default ChangeInfo;
