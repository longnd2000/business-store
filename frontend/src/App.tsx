import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';
import './App.css';

const App: React.FC = () => {
  const token = localStorage.getItem('admin_token');

  return (
    <Routes>
      <Route 
        path="/admin/login" 
        element={token ? <Navigate to="/admin/overview" replace /> : <Login />} 
      />
      <Route 
        path="/admin/*" 
        element={token ? <Dashboard /> : <Navigate to="/admin/login" replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/admin/overview" replace />} 
      />
    </Routes>
  );
};

export default App;
