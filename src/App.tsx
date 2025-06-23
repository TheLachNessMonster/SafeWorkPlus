import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import Profile from './pages/Profile';
import Incidents from './pages/Incidents';
// import IncidentDetail from './pages/IncidentDetail';
import Workplaces from './pages/Workplaces';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/incidents" 
            element={
              <ProtectedRoute>
                <Incidents />
              </ProtectedRoute>
            } 
          />
          {/* <Route 
              path="/incidents/:id" 
               element={
               <ProtectedRoute>
                 <IncidentDetail />
               </ProtectedRoute>
            } 
          /> */}
          <Route 
              path="/workplaces" 
               element={
               <ProtectedRoute>
                 <Workplaces />
               </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-report" 
            element={
              <ProtectedRoute>
                <CreateReport />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;