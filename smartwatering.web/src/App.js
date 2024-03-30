import MainPage from './components/mainPageComponent/mainPageComponent.js';
import HistoryPage from './components/historyPageComponent/historyPageComponent.js';
import ChangeInfoPage from './components/changeInfoPageComponent/changeInfoPageComponent.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/information" element={<ChangeInfoPage />} />
        </Routes>
      </Router>
  );
}

export default App;
