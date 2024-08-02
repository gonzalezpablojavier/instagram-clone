import React from 'react';
import { Routes, Route as RouterRoute, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import RegistroUsuario from './components/RegistroUsuario';
import HowAreYou from './components/HowAreYou';
import PermisoTemporal from './components/PermisoTemporal';
import Presentismo from './components/Presentismo';
import { AuthProvider, useAuth } from './context/AuthContext';
import ManageMoods from './components/ManageMoods';
import PanelPermisosTemporales from './components/panelPermisosTemporales';
import PanelAdminVacaciones from './components/panelAdminVacaciones';
import PanelFeedBack from './components/panelFeedBack';
import Home from './components/Home';
import Vacaciones from './components/Vacaciones';
import FeedbackColaborador from './components/FeedbackColaborador';
import Unauthorized from './components/Unauthorized';
import Reconocemos from './components/Reconocemos';
import { Route } from './config/permissions';


const ProtectedRouteWithPermission: React.FC<{ path: Route; element: React.ReactElement }> = ({ path, element }) => {
  const { isAuthenticated, hasPermission } = useAuth();
 
  if (isAuthenticated === null) {
    // Estado de autenticación aún no determinado, puedes mostrar un loader aquí
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={Route.Login} />;
  }
 
  if (!hasPermission(path)) {
    return <Navigate to={Route.Unauthorized} />;
  }
 
  return element;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      {isAuthenticated && (
        <div className="lg:w-20 lg:flex-shrink-0">
          <BottomNav />
        </div>
      )}
      <div className="flex-grow flex flex-col  overflow-hidden">
        {isAuthenticated && <Header />}
        <main className={`flex-grow overflow-auto ${isAuthenticated ? 'mt-16 mb-16 lg:mb-0' : ''}`}>
          <Routes>
            <RouterRoute path={Route.Login} element={<Login />} />
            <RouterRoute path={Route.Unauthorized} element={<Unauthorized />} />
            <RouterRoute
              path={Route.PanelPermisosTemporales}
              element={
                <ProtectedRouteWithPermission
                  path={Route.PanelPermisosTemporales}
                  element={<PanelPermisosTemporales />}
                />
              }
            />


            <RouterRoute
              path={Route.Reconocemos}
              element={
                <ProtectedRouteWithPermission
                  path={Route.Reconocemos}
                  element={<Reconocemos />}
                />
              }
            />


            <RouterRoute
              path={Route.PanelFeedBack}
              element={
                <ProtectedRouteWithPermission
                  path={Route.PanelFeedBack}
                  element={<PanelFeedBack />}
                />
              }
            />

            <RouterRoute
              path={Route.FeedbackColaborador}
              element={
                <ProtectedRouteWithPermission
                  path={Route.FeedbackColaborador}
                  element={<FeedbackColaborador />}
                />
              }
            />

              <RouterRoute
              path={Route.PanelAdminVacaciones}
              element={
                <ProtectedRouteWithPermission
                  path={Route.PanelAdminVacaciones}
                  element={<PanelAdminVacaciones />}
                />
              }
            />
            <RouterRoute
              path={Route.Vacaciones}
              element={
                <ProtectedRouteWithPermission
                  path={Route.Vacaciones}
                  element={<Vacaciones />}
                />
              }
            />
            <RouterRoute
              path={Route.Home}
              element={
                <ProtectedRouteWithPermission
                  path={Route.Home}
                  element={<Home />}
                />
              }
            />
            <RouterRoute
              path={Route.HowAreYou}
              element={
                <ProtectedRouteWithPermission
                  path={Route.HowAreYou}
                  element={<HowAreYou />}
                />
              }
            />
            <RouterRoute
              path={Route.Registro}
              element={
                <ProtectedRouteWithPermission
                  path={Route.Registro}
                  element={<RegistroUsuario />}
                />
              }
            />
            <RouterRoute
              path={Route.ManageMoods}
              element={
                <ProtectedRouteWithPermission
                  path={Route.ManageMoods}
                  element={<ManageMoods />}
                />
              }
            />
            <RouterRoute
              path={Route.PermisoTemporal}
              element={
                <ProtectedRouteWithPermission
                  path={Route.PermisoTemporal}
                  element={<PermisoTemporal />}
                />
              }
            />
            <RouterRoute
              path={Route.Presentismo}
              element={
                <ProtectedRouteWithPermission
                  path={Route.Presentismo}
                  element={<Presentismo />}
                />
              }
            />
            <RouterRoute path="/" element={<Navigate to={Route.Home} />} />
            <RouterRoute path="*" element={<Navigate to={Route.Login} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;