// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Stories from './components/Stories';
import Feed from './components/Feed';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import Applications from './components/Applications';
import Reconocemos from './components/Reconocemos';
import RegistroUsuario from './components/RegistroUsuario';
import HowAreYou from './components/HowAreYou';
import PermisoTemporal from './components/PermisoTemporal';
import Presentismo from './components/Presentismo';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Header />}
      <div className={`flex-grow overflow-y-auto ${isAuthenticated ? 'mt-16 mb-16' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/how-are-you"
            element={
              <ProtectedRoute>
                <HowAreYou />
              </ProtectedRoute>
            }
          />

          <Route
            path="/registro"
            element={
              <ProtectedRoute>
                <RegistroUsuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permiso-temporal"
            element={
              <ProtectedRoute>
                <PermisoTemporal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/presentismo"
            element={
              <ProtectedRoute>
                <Presentismo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                   <HowAreYou />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reconocemos"
            element={
              <ProtectedRoute>
                <Reconocemos />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      {isAuthenticated && <BottomNav />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;
