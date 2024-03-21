import { useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import React, { useEffect, useState } from 'react';
import '../mainPageComponent/mainPageComponent.css'
import axios from 'axios';

const Footer = () => {
  const navigate = useNavigate();

  const handleSmartWateringClick = () => {
    navigate('/home');
  };

  return (
    <footer className='footer'>
      <div>
        <span className='general-name' onClick={handleSmartWateringClick}>SMART WATERING</span>
        <span className='user-name'>Hello, Ім'я</span>
      </div>
    </footer>
  );
};

const Menu = () => {
  return (
    <div className='menu'>
      <div className='buttons-container'>
          <button className='change-info-button'>Change infomation</button>
          <button className='history-button'>History watering</button>
          <button className='exit-button'>Exit</button>
      </div>
    </div>
  );
};

const MainPage = () => {
  const [userData, setUserData] = useState(null);
  const [isCheckedSprinkler, setIsCheckedSprinkler] = useState(false);
  const [isCheckedAutoMode, setIsCheckedAutoMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSwitchChangeSprinkler = (checked) => {
    setIsCheckedSprinkler(checked);
    axios.post(`https://localhost:7265/api/SmartWatering/set-status/${checked}/14`)//change id
      .then(
        handleReload
      )
      .catch(error => {
        console.error('Error updating sprinkler status:', error);
      });
  };
  const handleSwitchChangeAutoMode = (checked) => {
    setIsCheckedAutoMode(checked);
    axios.post(`https://localhost:7265/api/SmartWatering/set-auto-mode/${checked}/14 `)//change id
      .then(
        handleReload
      )
      .catch(error => {
        console.error('Error updating auto mode:', error);
      });
  };

  useEffect(() => {
    axios.get('https://localhost:7265/api/User/user-information/14') //change id
      .then(response => {
        setUserData(response.data);
        setIsCheckedSprinkler(response.data.wateringInformation.sprinklerStatus);
        setIsCheckedAutoMode(response.data.autoMode);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleReload = () => {
    axios.get('https://localhost:7265/api/User/user-information/14') //change id
      .then(response => {
        setUserData(response.data);
        setIsCheckedSprinkler(response.data.wateringInformation.sprinklerStatus);
        setIsCheckedAutoMode(response.data.autoMode);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  return (
    <div>
      <Footer />
      <Menu />
      <div className='general'>
        <div className='watering-system'>
          <div className='info'>
            <span className='turn-on'>Sprinkler status: {userData && userData.wateringInformation ? (userData.wateringInformation.sprinklerStatus ? 'on' : 'off') : 'not available'}.</span>
            <span className='humidity-level'>Humidity: {userData && userData.wateringInformation ? (userData.wateringInformation.humidityData) : 'not available'}%.</span>
          </div>
          <div className='switches'>
            <div className='status-sprinkler'>
              <span>Turn-on/off sprinkler</span>
              <Switch
                checked={isCheckedSprinkler}
                onChange={handleSwitchChangeSprinkler}
                onColor="#007bff"
                offColor="#ccc"
                checkedIcon={false}
                uncheckedIcon={false}
                borderRadius={0}
              />
            </div>
            <div className='status-auto-mode'>
              <span>Turn-on/off auto mode</span>
              <Switch
                checked={isCheckedAutoMode}
                onChange={handleSwitchChangeAutoMode}
                onColor="#007bff"
                offColor="#ccc"
                checkedIcon={false}
                uncheckedIcon={false}
                borderRadius={0}
              />
            </div>
            <button className='refresh-data' onClick={handleReload}>Refresh data</button>
          </div>
        </div>
        <div className='notifications-box'>
          <div class="notification" onClick={toggleNotifications}>
            <span>Inbox</span>
            <span class="badge">3</span>
          </div>
        </div>
        <div className='messages-box'>
        `{showNotifications && (
            <div className="messages">
              <p>Notification 1</p>
              <p>Notification 2</p>
              <p>Notification 3</p>
              <p>Notification 4</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
