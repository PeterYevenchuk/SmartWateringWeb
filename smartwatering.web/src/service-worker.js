import { HubConnectionBuilder } from '@microsoft/signalr';

let dataToSync = {};

self.addEventListener('install', () => {
});

self.addEventListener('activate', () => {
});

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
  const storedMessages = JSON.parse(localStorage.getItem('notifications')) || [];
  const updatedMessages = [...storedMessages, ...message];
  localStorage.setItem('notifications', JSON.stringify(updatedMessages));
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'syncData') {
    const messagesToSync = Object.values(dataToSync);
    dataToSync = {};
  }
});

export { connection };
