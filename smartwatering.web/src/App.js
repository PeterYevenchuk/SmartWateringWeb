import MainPage from './components/mainPageComponent/mainPageComponent.js';
import HistoryPage from './components/historyPageComponent/historyPageComponent.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Router>
  );
}

export default App;
