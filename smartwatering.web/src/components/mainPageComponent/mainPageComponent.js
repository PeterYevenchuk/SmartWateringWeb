import Switch from 'react-switch';
import React, { useEffect, useState } from 'react';
import '../mainPageComponent/mainPageComponent.css'
import axios from 'axios';
import NavigatorMenu from '../navigatorComponent/navigatorComponent.js';
import Auth from '../AuthComponent/authComponent.js'
import {jwtDecode} from 'jwt-decode';

const MainPage = () => {
  const [userData, setUserData] = useState(null);
  const [isCheckedSprinkler, setIsCheckedSprinkler] = useState(false);
  const [isCheckedAutoMode, setIsCheckedAutoMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [availableSprinklers, setAvailableSprinklers] = useState([]);
  const [sprinklers, setSprinklers] = useState([]);
  const [showSprinklerDropdown, setShowSprinklerDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messagesRef, setMessagesRef] = useState(null);
  const accessToken = Auth();
  const decodeToken = jwtDecode(accessToken);
  const userId = decodeToken.nameid;

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      const userNotifications = parsedNotifications.filter(i => Number(i.userId) === Number(userId));
      const storedMessages = localStorage.getItem('userNotifications');
      let updatedMessages = [];
      if (storedMessages) {
        const parsedStoredMessages = JSON.parse(storedMessages);
        updatedMessages = [...parsedStoredMessages, ...userNotifications.map(notification => ({ ...notification, isRead: false }))];
      } else {
        updatedMessages = userNotifications.map(notification => ({ ...notification, isRead: false }));
      }
      localStorage.setItem('userNotifications', JSON.stringify(updatedMessages));
      localStorage.removeItem('notifications');
    }
  }, []);

  useEffect(() => {
    const savedUserNotifications = localStorage.getItem('userNotifications');
    if (savedUserNotifications) {
      const parsedUserNotifications = JSON.parse(savedUserNotifications);
      setNotifications(parsedUserNotifications);
      const unreadCount = parsedUserNotifications.filter(notification => !notification.isRead).length;
      setUnreadNotifications(unreadCount);
    }
  }, []);

  const fetchUserAvailableSprinklers = () => {
    axios.get(`https://localhost:44365/api/User/user-available-sprinklers/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setSprinklers(response.data);
    })
    .catch(error => {
      console.error('Error fetching user available sprinklers:', error);
    });
  };

  useEffect(() => {
    fetchUserAvailableSprinklers();
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSwitchChangeSprinkler = (checked) => {
    setIsCheckedSprinkler(checked);
    axios.post(`https://localhost:44365/api/SmartWatering/set-status/${checked}/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      })
      .then(
        handleReload
      )
      .catch(error => {
        console.error('Error updating sprinkler status:', error);
      });
  };
  const handleSwitchChangeAutoMode = (checked) => {
    setIsCheckedAutoMode(checked);
    axios.post(`https://localhost:44365/api/SmartWatering/set-auto-mode/${checked}/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      })
      .then(
        handleReload
      )
      .catch(error => {
        console.error('Error updating auto mode:', error);
      });
  };

  useEffect(() => {
    axios.get(`https://localhost:44365/api/User/user-information/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      })
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
    axios.get(`https://localhost:44365/api/User/user-information/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      })
      .then(response => {
        setUserData(response.data);
        setIsCheckedSprinkler(response.data.wateringInformation.sprinklerStatus);
        setIsCheckedAutoMode(response.data.autoMode);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  const handleDeleteSprinkler = (sprinklerId) => {
    axios.delete(`https://localhost:44365/api/SmartWatering/delete-sprinkler/${sprinklerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      })
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Error delete sprinkler:', error);
      });
  };

  const fetchSprinklers = () => {
    axios.get('https://localhost:44365/api/SmartWatering/available-sprinklers', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setAvailableSprinklers(response.data);
    })
    .catch(error => {
      console.error('Error fetching sprinklers:', error);
    });
  };

  useEffect(() => {
    fetchSprinklers();
  }, []);

  const toggleSprinklerDropdown = () => {
    setShowSprinklerDropdown(!showSprinklerDropdown);
  };

  const handleAddSprinkler = (sprinklerName) => {
    const sprinklerData = {
      userId: userId,
      sprinklerNameId: sprinklerName
    };
  
    axios.post('https://localhost:44365/api/SmartWatering/set-sprinkler', sprinklerData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      window.location.reload();
    })
    .catch(error => {
      console.error('Error adding sprinkler:', error);
    });
  };

  const renderNotifications = () => {
    if (notifications.length === 0) {
      return <p>No notifications</p>;
    }

    return (
      <ul>
        {notifications.map((notification, index) => (
          <li className='messages-white-box'>
            <h4 key={index}>{notification.dateTime}</h4>
            <span key={index}>{notification.dayTimeZone} {notification.message}</span>
            {!notification.isRead && (
              <button className='read-message' onClick={() => markAsRead(index)}>Mark as read</button>
            )}
          </li>
        ))}
        <li ref={setMessagesRef}></li>
      </ul>
    );
  };

  useEffect(() => {
    if (messagesRef && showNotifications) {
      messagesRef.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messagesRef]);

  const markAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].isRead = true;
    setNotifications(updatedNotifications);
    setUnreadNotifications(prevUnreadNotifications => prevUnreadNotifications - 1);
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => {
      return { ...notification, isRead: true };
    });
    setNotifications(updatedNotifications);
    setUnreadNotifications(0);
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
  };

  const deleteAllMessages = () => {
    setUnreadNotifications(0);
    setNotifications([]);
    localStorage.removeItem('userNotifications');
  };

  return (
    <div>
        <NavigatorMenu />
      <div className='general'>
        {sprinklers.map(sprinkler => (
          <div className='watering-system' key={sprinkler.id}>
            <div className='info'>
              <h3 className='name'>Sprinkler: {sprinkler.sprinklerNameId}</h3>
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
              <button className='delete-data' onClick={() => handleDeleteSprinkler(sprinkler.id)}>Delete</button>
            </div>
          </div>
        ))}
        <div className='add-new-sprinkler-box'>
          <button className='add-new-sprinkler-button' onClick={toggleSprinklerDropdown}>
              <p>Add sprinkler</p>
          </button>
          {showSprinklerDropdown && (
            <div className="sprinkler-dropdown">
              <ul>
                {availableSprinklers.map(sprinkler => (
                  <li className='sprinkler-dropdown-data' key={sprinkler} onClick={() => handleAddSprinkler(sprinkler)}>{sprinkler}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className='notifications-box'>
          <div class="notification" onClick={toggleNotifications}>
            <span>Inbox</span>
            {unreadNotifications !== 0 &&
              <span className="badge">{unreadNotifications}</span>}
          </div>
        </div>
        <div className='messages-box'>
          {showNotifications && (
            <div className="messages">
              {renderNotifications()}
              <div className='buttons-messages'>
                {unreadNotifications !== 0 &&
                  <button onClick={markAllAsRead} className='all-read-button'>Mark all as read</button>}
                {notifications.length !== 0 &&
                  <button onClick={deleteAllMessages} className='all-delete-button'>Delete all</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
