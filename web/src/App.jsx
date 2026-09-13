import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReportItem from './pages/ReportItem';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import MyReports from './pages/MyReports';
import PublicWall from './pages/PublicWall';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageReports from './pages/ManageReports';
import ReviewMatches from './pages/ReviewMatches';
import AdminCategories from './pages/AdminCategories';
import AdminLocations from './pages/AdminLocations';
import AdminAuditLogs from './pages/AdminAuditLogs';
import AdminNotifications from './pages/AdminNotifications';
import AdminSettings from './pages/AdminSettings';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoutes';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div className="min-h-screen text-slate-900 transition-colors duration-300 font-sans">
      <BrowserRouter>
        <Routes>
          {/* Default App Layout wrapping Navbar */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Student Routes within User Layout */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/report/:type" element={<ReportItem />} />
              <Route path="/report/new" element={<ReportItem />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/wall" element={<PublicWall />} />
            </Route>
          </Route>

          {/* Protected Admin Sidebar Layout */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/reports" element={<ManageReports />} />
              <Route path="/admin/matches" element={<ReviewMatches />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/locations" element={<AdminLocations />} />
              <Route path="/admin/audit" element={<AdminAuditLogs />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
