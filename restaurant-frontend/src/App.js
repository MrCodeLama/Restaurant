import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './components/MenuPage';

const App = () => {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="*" element={<MenuPage />} /> {/* Обробка всіх інших маршрутів */}
        </Routes>
      </Router>
  );
};

export default App;
