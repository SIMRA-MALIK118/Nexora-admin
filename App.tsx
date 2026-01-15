
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/Projects/ProjectsList';
import BlogsList from './pages/Blogs/BlogsList';
import JobsList from './pages/Careers/JobsList';
import ServicesList from './pages/Services/ServicesList';
import Login from './pages/Login';
import { AppRoute } from './types';

// Helper component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('ca_admin_token') === 'authenticated_session_true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={AppRoute.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={AppRoute.LOGIN} element={<Login />} />
        
        {/* Protected Layout Routes */}
        <Route 
          path={AppRoute.DASHBOARD} 
          element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} 
        />
        <Route 
          path={AppRoute.PROJECTS} 
          element={<ProtectedRoute><Layout><ProjectsList /></Layout></ProtectedRoute>} 
        />
        <Route 
          path={AppRoute.SERVICES} 
          element={<ProtectedRoute><Layout><ServicesList /></Layout></ProtectedRoute>} 
        />
        <Route 
          path={AppRoute.BLOGS} 
          element={<ProtectedRoute><Layout><BlogsList /></Layout></ProtectedRoute>} 
        />
        <Route 
          path={AppRoute.CAREERS} 
          element={<ProtectedRoute><Layout><JobsList /></Layout></ProtectedRoute>} 
        />

        {/* Redirect unknown routes to Dashboard (which will trigger protection if needed) */}
        <Route path="*" element={<Navigate to={AppRoute.DASHBOARD} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
