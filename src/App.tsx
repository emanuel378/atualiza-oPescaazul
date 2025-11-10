// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Dashboard from './Dashboardok/pages/Dashboard';
import Perfil from './pages/Perfil';
import MapScreen from './screens/MapScreen';

import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard onNavigate={function (screen: 'dashboard' | 'map'): void {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/map" element={<MapScreen />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;