import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../mainPageComponent/mainPageComponent.css';
import '../navigatorComponent/navigatorComponent.css';

const Footer = () => {
    const navigate = useNavigate();
    const handleSmartWateringClick = () => {
      navigate('/home');
    };
  
    return (
      <footer className='footer'>
        <div>
          <span className='general-name' onClick={handleSmartWateringClick}>SMART WATERING</span>
          <span className='user-name'>Hello, userFullName</span>
        </div>
      </footer>
    );
  };

const Menu = () => {
    const navigate = useNavigate();
  
    const handleHistoryClick = () => {
      navigate('/history');
    };

    const handleChangeInfoClick = () => {
      navigate('/information');
    };

    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
    };
    
    return (
      <div className='menu'>
        <div className='buttons-container'>
            <button className='change-info-button' onClick={handleChangeInfoClick}>Change infomation</button>
            <button className='history-button' onClick={handleHistoryClick}>History watering</button>
            <button className='exit-button' onClick={handleLogout}>Exit</button>
        </div>
      </div>
    );
  };

  const NavigatorMenu = () => {
    return (
      <div>
        <Footer />
        <Menu />
      </div>
    );
  };

  export default NavigatorMenu;