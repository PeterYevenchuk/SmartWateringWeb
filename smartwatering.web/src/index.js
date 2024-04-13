import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { connection } from './service-worker';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (connection.state === 'Disconnected') {
  connection.start()
    .then(() => console.log('Connected to SignalR server in service worker'))
    .catch(err => console.error('Error connecting to SignalR server in service worker:', err));
}
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
