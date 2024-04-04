import NavigatorMenu from '../navigatorComponent/navigatorComponent.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../historyPageComponent/historyPageComponent.css';

const History = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:44365/api/User/user-sensor-information/14') //change id
          .then(response => {
            setUserData(response.data.reverse());
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      }, []);

return (
    <div>
        <NavigatorMenu />
        <div className='general'>
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Start Date</th>
                            <th>Start Level</th>
                            <th>End Date</th>
                            <th>End Level</th>
                            <th>Wasted Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.startDate}</td>
                                <td>{data.startLevel}</td>
                                <td>{data.endDate}</td>
                                <td>{data.endLevel}</td>
                                <td>{data.wastedTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)};

export default History;