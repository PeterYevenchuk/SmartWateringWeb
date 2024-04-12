import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { connection } from './service-worker';

const root = ReactDOM.createRoot(document.getElementById('root'));
connection.start();
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
