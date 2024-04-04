import NavigatorMenu from '../navigatorComponent/navigatorComponent.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../historyPageComponent/historyPageComponent.css';
import {jwtDecode} from 'jwt-decode';
import Auth from '../AuthComponent/authComponent.js'

const History = () => {
    const [userData, setUserData] = useState([]);
    const accessToken = Auth();
    const decodeToken = jwtDecode(accessToken);
    const userId = decodeToken.nameid;

    useEffect(() => {
        axios.get(`https://localhost:44365/api/User/user-sensor-information/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            })
          .then(response => {
            setUserData(response.data.reverse());
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      }, [userId]);

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