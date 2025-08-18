import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConsistencyPathListPage from './components/dashboard/ConsistencyPathListPage';
import ConsistencyPathsCreatePage from './pages/ConsistencyPathsCreatePage';
import ConsistencyPathsViewPage from './pages/ConsistencyPathsViewPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/consistency-paths" element={<ConsistencyPathListPage />} />
  <Route path="/consistency-paths/create" element={<ConsistencyPathsCreatePage />} />
  <Route path="/consistency-paths/:id" element={<ConsistencyPathsViewPage />} />
  <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;