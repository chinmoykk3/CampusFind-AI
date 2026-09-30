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
import Notifications from './pages/Notifications';
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
import { Toaster, toast } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ThemeProvider } from './components/ui/ThemeProvider';

function App() {
  const { checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('join', user._id || user.id);
    });

    socket.on('ai_match_found', (data) => {
      toast.success(
        <div>
          <h4 className="font-semibold text-slate-800">{data.title}</h4>
          <p className="text-sm text-slate-600">{data.message}</p>
        </div>,
        { duration: 8000, icon: '🤖' }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);
  return (
    <ThemeProvider defaultTheme="system" storageKey="campusfind-ui-theme">
      <div className="min-h-screen transition-colors duration-300 font-sans">
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
                <Route path="/notifications" element={<Notifications />} />
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
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-slate-900 dark:text-slate-100',
            }}
          />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
