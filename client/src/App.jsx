import { Routes, Route, Navigate } from 'react-router-dom';
import { getAuthUser } from './api';

import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bikes from './pages/Bikes';
import BikeDetail from './pages/BikeDetail';
import ServiceHistory from './pages/ServiceHistory';
import MileageTracker from './pages/MileageTracker';
import Expenses from './pages/Expenses';
import Photos from './pages/Photos';

function ProtectedRoute({ children }) {
  const user = getAuthUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="bikes"
          element={
            <ProtectedRoute>
              <Bikes />
            </ProtectedRoute>
          }
        />
        <Route
          path="bikes/:bikeId"
          element={
            <ProtectedRoute>
              <BikeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="bikes/:bikeId/services"
          element={
            <ProtectedRoute>
              <ServiceHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="bikes/:bikeId/mileage"
          element={
            <ProtectedRoute>
              <MileageTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="bikes/:bikeId/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="photos"
          element={
            <ProtectedRoute>
              <Photos />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
