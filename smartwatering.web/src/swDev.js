export default function swDev() {
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
  
    const registerServiceWorker = () => {
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error);
        });
    };
  
    const checkServiceWorkerState = () => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (!registration || !registration.active) {
          console.log('Service worker is not running, registering...');
          registerServiceWorker();
        }
      });
    };
  
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration || !registration.active) {
        console.log('Service worker is not running, registering...');
        registerServiceWorker();
      }
    });
  
    const intervalId = setInterval(checkServiceWorkerState, 30000);
  
    return () => clearInterval(intervalId);
  }