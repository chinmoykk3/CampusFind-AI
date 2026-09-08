import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, Users, ShieldAlert, BarChart3, LogOut, Search, Settings, Database, Tags, MapPin, ShieldCheck, BellRing } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();

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
        { path: '/admin/notifications', icon: <BellRing className="w-5 h-5" />, name: 'Broadcasts' },
        { path: '/admin/audit', icon: <ShieldCheck className="w-5 h-5" />, name: 'Audit Logs' },
        { path: '/admin/settings', icon: <Settings className="w-5 h-5" />, name: 'Settings' }
    ];

    return (
        <div className="min-h-screen flex bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 hidden md:flex flex-col bg-slate-900 border-r border-slate-800 relative z-20">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Hexagon className="h-8 w-8 text-indigo-500" fill="currentColor" fillOpacity={0.2} />
                    <span className="font-bold text-xl tracking-tight text-white font-serif">
                        Campus<span className="text-indigo-400">Admin</span>
                    </span>
                </div>

                <div className="p-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Command Center</p>
                    <nav className="space-y-2">
                        {sidebarLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'}`}
                                >
                                    {link.icon}
                                    <span className="font-medium text-sm">{link.name}</span>
                                    {isActive && (
                                        <motion.div layoutId="sidebar-indicator" className="absolute left-6 w-1 h-8 bg-indigo-500 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-6 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'Administrator'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-colors border border-transparent hover:border-red-900/30">
                        <LogOut className="w-4 h-4" />
                        Terminate Session
                    </button>
                    <Link to="/" className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                        Return to App
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Admin Top Header */}
                <header className="h-20 lg:hidden flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 flex-shrink-0 z-10">
                    <div className="flex items-center gap-2">
                        <Hexagon className="h-6 w-6 text-indigo-500" />
                        <span className="font-bold text-lg text-white font-serif">Admin</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto w-full">
                    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full relative z-10">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ ease: "easeOut", duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </div>
                </div>

                {/* Embedded mesh background specifically dark for admin */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(at 0% 0%, hsla(220, 100%, 12%, 0.4) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(280, 100%, 10%, 0.4) 0px, transparent 50%)'
                }}></div>
            </main>
        </div>
    );
};

export default AdminLayout;
