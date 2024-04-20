import { HubConnectionBuilder } from '@microsoft/signalr';
  
let dataToSync = {};

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', () => {
});

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('activate', () => {
});

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('fetch', () => {
});

const connection = new HubConnectionBuilder()
  .withUrl('https://localhost:44365/ws')
  .build();

connection.start()
  .then(() => console.log('Connected to SignalR server in service worker'))
  .catch(err => console.error('Error connecting to SignalR server in service worker:', err));

connection.on('ReceiveMessage', message => {
  dataToSync[message.id] = message;
});

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('sync', function(event) {
  if (event.tag === 'syncData') {
    dataToSync = {};
  }
});

export { connection };
