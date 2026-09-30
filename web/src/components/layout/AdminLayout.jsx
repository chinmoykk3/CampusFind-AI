import React, { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, LogOut, Settings, Database, Tags, MapPin, ShieldCheck, BellRing, BarChart3, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axios';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const [unreadCount, setUnreadCount] = useState(0);
    const pollRef = useRef(null);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/admin/unread-count');
            setUnreadCount(res.data.count || 0);
        } catch {
            // silently ignore — user might not be admin yet
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        pollRef.current = setInterval(fetchUnreadCount, 30000); // poll every 30s
        return () => clearInterval(pollRef.current);
    }, []);

    // Refresh badge count from DB when admin visits the notifications page
    // (mark-all-read is called by that page, so count will be 0)
    useEffect(() => {
        if (location.pathname === '/admin/notifications') {
            // Short delay to let the page's mark-all-read call complete first
            const t = setTimeout(fetchUnreadCount, 800);
            return () => clearTimeout(t);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const sidebarLinks = [
        { path: '/admin', icon: <BarChart3 className="w-5 h-5" />, name: 'Analytics' },
        { path: '/admin/users', icon: <Users className="w-5 h-5" />, name: 'Manage Users' },
        { path: '/admin/reports', icon: <Database className="w-5 h-5" />, name: 'Case Control' },
        { path: '/admin/matches', icon: <ShieldAlert className="w-5 h-5" />, name: 'AI Matches' },
        { path: '/admin/categories', icon: <Tags className="w-5 h-5" />, name: 'Categories' },
        { path: '/admin/locations', icon: <MapPin className="w-5 h-5" />, name: 'Locations' },
        { path: '/admin/notifications', icon: <BellRing className="w-5 h-5" />, name: 'Broadcasts', badge: unreadCount },
        { path: '/admin/audit', icon: <ShieldCheck className="w-5 h-5" />, name: 'Audit Logs' },
        { path: '/admin/settings', icon: <Settings className="w-5 h-5" />, name: 'Settings' },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 hidden md:flex flex-col bg-white border-r border-slate-200 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="bg-primary-600 text-white p-2 rounded-lg">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-primary-900 font-display">
                        Campus<span className="font-medium text-primary-600">Admin</span>
                    </span>
                </div>

                <div className="p-6 overflow-y-auto flex-1 h-0 scrollbar-hide">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">Command Center</p>
                    <nav className="space-y-1">
                        {sidebarLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-600 hover:text-primary-900 hover:bg-slate-50 border border-transparent'}`}
                                >
                                    {link.icon}
                                    <span className="text-sm flex-1">{link.name}</span>

                                    {/* Notification Badge */}
                                    {link.badge > 0 && (
                                        <motion.span
                                            key={link.badge}
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm"
                                        >
                                            {link.badge > 99 ? '99+' : link.badge}
                                        </motion.span>
                                    )}

                                    {isActive && (
                                        <motion.div layoutId="sidebar-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-extrabold text-sm border border-primary-200">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-primary-900 truncate">{user?.name || 'Administrator'}</p>
                            <p className="text-[11px] font-semibold text-slate-500 truncate">{user?.role || 'Super Admin'}</p>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100">
                        <LogOut className="w-4 h-4" />
                        Terminate Session
                    </button>
                    <Link to="/" className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-slate-500 hover:text-primary-700 hover:bg-slate-100 rounded-xl transition-colors border border-transparent">
                        Return to Public App
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50/50">
                {/* Admin Top Header (Mobile) */}
                <header className="h-20 md:hidden flex items-center justify-between px-6 bg-white border-b border-slate-200 flex-shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <span className="font-extrabold text-xl text-primary-900 font-display">CampusAdmin</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-rose-600 bg-rose-50 rounded-lg">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto w-full">
                    {/* Breadcrumbs */}
                    <div className="px-6 md:px-10 pt-8 pb-2 max-w-7xl mx-auto w-full relative z-10">
                        <div className="flex items-center text-xs font-medium text-slate-500 mb-2 gap-2">
                            <span>Admin Portal</span>
                            <span>/</span>
                            <span className="text-primary-600">{location.pathname.split('/').pop() || 'Dashboard'}</span>
                        </div>
                    </div>

                    <div className="px-6 md:px-10 pb-10 max-w-7xl mx-auto w-full relative z-10">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ease: 'easeOut', duration: 0.2 }}
                        >
                            <Outlet />
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
