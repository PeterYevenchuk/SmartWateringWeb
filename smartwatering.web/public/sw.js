self.importScripts('https://cdn.jsdelivr.net/npm/@microsoft/signalr@latest/dist/browser/signalr.min.js');

let connection;
let connectionInterval;

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

function checkConnection() {
  if (connection.state !== 'Connected') {
    console.log('Reconnecting to SignalR server...');
    connection.start()
      .then(() => console.log('Connected to SignalR server'))
      .catch(err => console.error('Error connecting to SignalR server:', err));
  }
}

connection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:44365/ws')
  .build();

connection.start()
  .then(() => {
    console.log('Connected to SignalR server in service worker');
    connectionInterval = setInterval(checkConnection, 10000);
  })
  .catch(err => console.error('Error connecting to SignalR server in service worker:', err));

connection.on('ReceiveMessage', message => {
  console.log(message);
  self.registration.showNotification('SMART WATERING\n\nYou have a new message!\nClick to see the message.');
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll().then(clients => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('/');
      }
    })
  );
});

console.warn("ws file in public folder");