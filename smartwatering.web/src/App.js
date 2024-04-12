import MainPage from './components/mainPageComponent/mainPageComponent.js';
import HistoryPage from './components/historyPageComponent/historyPageComponent.js';
import ChangeInfoPage from './components/changeInfoPageComponent/changeInfoPageComponent.js';
import LoginPage from './components/loginPageComponent/loginPageComponent.js';
import RegisterPage from './components/registerPageComponent/registerPageComponent.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/information" element={<ChangeInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;