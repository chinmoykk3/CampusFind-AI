import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuthStore();

    if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};
