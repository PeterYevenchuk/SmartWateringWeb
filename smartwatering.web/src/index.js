import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { connection } from './service-worker.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      console.log(registration);
      if (registration) {
        console.log('Service Worker is already registered:', registration);
        
        if (registration.active) {
          console.log('Service Worker is already active');
        } else if (registration.installing) {
          console.log('Service Worker is installing');
        }
      } else {
        const newRegistration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`);
        console.log('Service Worker registered:', newRegistration);
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

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
