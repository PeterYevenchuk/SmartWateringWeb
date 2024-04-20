import Switch from 'react-switch';
import React, { useEffect, useState } from 'react';
import '../mainPageComponent/mainPageComponent.css'
import axios from 'axios';
import NavigatorMenu from '../navigatorComponent/navigatorComponent.js';
import Auth from '../AuthComponent/authComponent.js'
import {jwtDecode} from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const MainPage = () => {
  const [userData, setUserData] = useState(null);
  const [isCheckedSprinkler, setIsCheckedSprinkler] = useState(false);
  const [isCheckedAutoMode, setIsCheckedAutoMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [availableSprinklers, setAvailableSprinklers] = useState([]);
  const [sprinklers, setSprinklers] = useState([]);
  const [showSprinklerDropdown, setShowSprinklerDropdown] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messagesRef, setMessagesRef] = useState(null);

  const accessToken = Auth();
  const decodeToken = jwtDecode(accessToken);
  const userId = decodeToken.nameid;

  useEffect(() => {
    userMessages();
  }, []);

  const userMessages = () => {
    axios.get(`https://localhost:44365/api/Messages/user-messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      })
      .then(response => {
        setNotifications(response.data.messages);
        setUnreadNotifications(response.data.countUnRead)
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

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

  useEffect(() => {
    axios.get(`https://localhost:44365/api/Weather/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      })
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }, []);

  const renderWeatherCards = () => {
    return weatherData.map((data, index) => (
      <div className="weather-card" key={index}>
        <p className='weather-p-data'>{data.dt_txt}</p>
        <p className='weather-p'>Temperature: {data.main.temp}°C.</p>
        <p className='weather-p'>Feels like: {data.main.feels_like}°C.</p>
        <p className='weather-p'>Humidity: {data.main.humidity}%.</p>
        <p className='weather-p'>Wind: {data.wind.speed} m/s.</p>
        <p className='weather-p'>Clouds: {data.clouds.all}%.</p>
        <p className='weather-p'>Weather: {data.weather[0].main}.</p>
        <div className='weather-data-image'>
          <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="Weather icon" />
          <p className='weather-p'> - {data.weather[0].description}.</p>
        </div>
      </div>
    ));
  };

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
              <div className='messages-buttons'>
                <button className='read-message' onClick={() => markAsRead(index)}>Mark as read</button>
                <button className='delete-message' onClick={() => deleteMessage(index)}>Delete</button>
              </div>
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
    axios.patch(`https://localhost:44365/api/Messages/read-message/${updatedNotifications[index].id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch(error => {
      console.error('Error adding sprinkler:', error);
    });
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => {
      return { ...notification, isRead: true };
    });
    setNotifications(updatedNotifications);
    setUnreadNotifications(0);
    axios.patch(`https://localhost:44365/api/Messages/read-all-messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch(error => {
      console.error('Error adding sprinkler:', error);
    });
  };

  const deleteAllMessages = () => {
    setUnreadNotifications(0);
    setNotifications([]);
    axios.delete(`https://localhost:44365/api/Messages/delete-all-message/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch(error => {
      console.error('Error adding sprinkler:', error);
    });
  };

  const deleteMessage = (index) => {
    const updatedNotifications = [...notifications];
    setNotifications(updatedNotifications);
    setUnreadNotifications(prevUnreadNotifications => prevUnreadNotifications - 1);
    axios.delete(`https://localhost:44365/api/Messages/delete-message/${updatedNotifications[index].id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      userMessages();
    })
    .catch(error => {
      console.error('Error adding sprinkler:', error);
    });
  };

  return (
    <div>
        <NavigatorMenu />
      <div className='general'>
      <div className="weather-container">
        <h3 className='weather-name'>Today weather forecast in {userData ? (userData.city) : 'not available'}</h3>
        <div className="weather-cards-container">
          {renderWeatherCards()}
        </div>
      </div>
        <h3 className='sprinkler-name'>Sprinklers</h3>
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
              <FontAwesomeIcon icon={faSyncAlt} className="refresh-icon" onClick={handleReload} />
              <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDeleteSprinkler(sprinkler.id)} />

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
