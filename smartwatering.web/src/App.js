import MainPage from './components/mainPageComponent/mainPageComponent.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/home" element={<MainPage />} />
        </Routes>
      </Router>
  );
}

export default App;
