import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, Menu, X, LogOut, ChevronDown, User, Bell, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 transition-all shadow-sm">
            {/* Announcement Ticker directly integrated into Navbar or slightly below? No, prompt says below the navigation for Home. Let's keep Navbar clean. */}
            <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center bg-white">

                {/* Logo Section */}
                <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
                    <div className="bg-primary-600 text-white p-1.5 sm:p-2 rounded-lg transition-transform group-hover:scale-105">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl sm:text-2xl tracking-tight text-primary-900 font-display">
                        Campus<span className="font-medium text-primary-600">Find</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-semibold">
                    <NavLink to="/" current={location.pathname}>Home</NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/dashboard" current={location.pathname}>Dashboard</NavLink>
                            <NavLink to="/wall" current={location.pathname}>Explore Logs</NavLink>
                            <NavLink to="/matches" current={location.pathname}>Matches</NavLink>
                            {user?.role === 'admin' && (
                                <NavLink to="/admin" current={location.pathname}>Admin</NavLink>
                            )}
                        </>
                    )}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/report/new" className="premium-button flex items-center gap-2 px-4 py-2 hover:bg-primary-700">
                                <Plus className="h-4 w-4" />
                                <span>Report Item</span>
                            </Link>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <div className="relative group" onMouseEnter={() => setAvatarMenuOpen(true)} onMouseLeave={() => setAvatarMenuOpen(false)}>
                                <button className="flex items-center gap-2 w-9 h-9 sm:w-auto sm:px-3 sm:py-1.5 rounded-full sm:rounded-lg bg-slate-100 text-primary-700 font-bold text-sm border border-slate-200 focus-visible:ring-2 focus-visible:ring-primary-600 hover:bg-slate-200 transition-colors">
                                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs">{user?.name?.charAt(0) || 'U'}</span>
                                    <span className="hidden sm:block">{user?.name?.split(' ')[0] || 'User'}</span>
                                    <ChevronDown className="hidden sm:block w-4 h-4 opacity-50" />
                                </button>

                                <AnimatePresence>
                                    {avatarMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 py-2 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                                <p className="text-sm font-bold text-primary-900 truncate">{user?.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                            </div>
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                                <User className="w-4 h-4 text-slate-500" />
                                                Profile Setup
                                            </Link>
                                            {user?.role === 'admin' ? (
                                                <>
                                                    <Link to="/admin/notifications" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                                        <Bell className="w-4 h-4 text-slate-500" />
                                                        System Broadcasts
                                                    </Link>
                                                    <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                                        <Settings className="w-4 h-4 text-slate-500" />
                                                        Admin Settings
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                                        <Bell className="w-4 h-4 text-slate-500" />
                                                        My Notifications
                                                    </Link>
                                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                                        <Settings className="w-4 h-4 text-slate-500" />
                                                        Account Settings
                                                    </Link>
                                                </>
                                            )}
                                            <div className="h-px bg-slate-100 my-1"></div>
                                            <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left">
                                                <LogOut className="w-4 h-4 text-red-500" />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors px-2 py-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
                                Log In
                            </Link>
                            <Link to="/register" className="premium-button px-5 py-2 hover:bg-primary-700">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="flex bg-white z-50 md:hidden items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-slate-600 rounded-md hover:bg-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors"
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 overflow-y-auto md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col px-4 py-6 gap-2">
                            <MobileNavLink to="/" current={location.pathname}>Home</MobileNavLink>
                            {isAuthenticated ? (
                                <>
                                    <MobileNavLink to="/dashboard" current={location.pathname}>Dashboard</MobileNavLink>
                                    <MobileNavLink to="/wall" current={location.pathname}>Explore Logs</MobileNavLink>
                                    <MobileNavLink to="/matches" current={location.pathname}>Matches</MobileNavLink>
                                    <Link to="/report/new" className="w-full text-center mt-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-sm">
                                        + Report Item
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <MobileNavLink to="/admin" current={location.pathname}>Admin Panel</MobileNavLink>
                                    )}
                                    <div className="h-px w-full bg-slate-100 my-4"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 font-semibold rounded-lg hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 outline-none transition-colors">
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="w-full text-center px-4 py-3 bg-slate-50 text-primary-900 font-semibold rounded-lg border border-slate-200 transition-colors hover:bg-slate-100">Log In</Link>
                                    <Link to="/register" className="w-full text-center px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg mt-2 transition-colors hover:bg-primary-700">Create Account</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

const NavLink = ({ to, current, children }) => {
    const isActive = current === to;
    return (
        <Link
            to={to}
            className={`
                relative px-2 py-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md
                ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-900'}
            `}
        >
            {children}
            {isActive && (
                <div className="absolute -bottom-1.5 left-2 right-2 h-0.5 bg-primary-600 rounded-t-full" />
            )}
        </Link>
    )
}

const MobileNavLink = ({ to, current, children }) => {
    const isActive = current === to;
    return (
        <Link
            to={to}
            className={`
                px-4 py-3 rounded-lg text-base font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-600
                ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'}
            `}
        >
            {children}
        </Link>
    )
}

export default Navbar;
