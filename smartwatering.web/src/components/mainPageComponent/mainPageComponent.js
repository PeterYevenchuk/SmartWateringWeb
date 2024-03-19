import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../mainPageComponent/mainPageComponent.css'

const Footer = () => {
  const navigate = useNavigate();

  const handleSmartWateringClick = () => {
    navigate('/home');
  };

  return (
    <footer className='footer'>
      <Container>
        <span className='general-name' onClick={handleSmartWateringClick}>SMART WATERING</span>
        <span className='user-name'>Hello, Ім'я</span>
      </Container>
    </footer>
  );
};

const Menu = () => {
  return (
    <div className='menu'>
      <Container className='buttons-container'>
          <button className='change-info-button'>Change infomation</button>
          <button className='history-button'>History watering</button>
          <button className='exit-button'>Exit</button>
      </Container>
    </div>
  );
};

const MainPage = () => {
  return (
    <div>
      <Footer />
      <Menu />
    </div>
  );
};

export default MainPage;
