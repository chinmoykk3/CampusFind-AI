import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Bell, Hexagon, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Navbar = () => {
    const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="w-full flex justify-center pt-8 px-4 relative z-50">
            <nav className="floating-nav w-full max-w-5xl rounded-full px-4 sm:px-6 py-3 flex justify-between items-center">

                {/* Logo Section */}
                <div onClick={() => navigate('/')} className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
                        <Hexagon className="h-6 w-6 text-indigo-400 group-hover:text-purple-400 transition-colors" />
                    </motion.div>
                    <span className="font-bold text-lg tracking-tight text-white font-serif">
                        Campus<span className="text-indigo-400 font-sans font-light">Find</span>
                    </span>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center space-x-1 bg-white/5 p-1 rounded-full border border-white/10">
                    <NavLink to="/" current={location.pathname}>Home</NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/dashboard" current={location.pathname}>Nexus</NavLink>
                            <NavLink to="/my-reports" current={location.pathname}>Archive</NavLink>
                            <NavLink to="/matches" current={location.pathname} highlight>Telemetry</NavLink>
                            {user?.role === 'admin' && (
                                <NavLink to="/admin" current={location.pathname} admin>Admin</NavLink>
                            )}
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    {isAuthenticated ? (
                        <>
                            <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
                                <Bell className="h-4 w-4" />
                            </button>
                            <Link to="/report/new" className="hidden sm:flex premium-button items-center gap-2 px-5 py-2 text-sm font-bold">
                                <Plus className="h-4 w-4" />
                                <span>Report Item</span>
                            </Link>
                            <div className="h-8 w-px bg-white/10 mx-2"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20 shadow-lg cursor-pointer">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-full hover:bg-white/10" title="Terminate Session">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2">Sign In</Link>
                            <Link to="/register" className="premium-button px-5 py-2 text-sm font-bold shadow-lg">Authenticate</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

const NavLink = ({ to, current, children, highlight, admin }) => {
    const isActive = current === to;

    return (
        <Link
            to={to}
            className={`
                relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${isActive ? 'text-white bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                ${highlight ? 'text-indigo-300' : ''}
                ${admin ? 'text-rose-400/80 hover:text-rose-400' : ''}
            `}
        >
            {children}
            {isActive && (
                <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 border border-white/20 rounded-full pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </Link>
    )
}

export default Navbar;
