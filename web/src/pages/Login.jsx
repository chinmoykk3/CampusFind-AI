import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Mail, Lock, ShieldAlert, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (!email || !password) {
            setLocalError('Please fill out all fields');
            return;
        }

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            // Error handled by store
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full premium-card p-8 sm:p-10 bg-white"
            >
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="bg-primary-600 text-white p-2.5 rounded-xl mb-6 shadow-sm">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-primary-900 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-600 mt-2 font-medium">Sign in to your CampusFind account</p>
                </div>

                {(error || localError) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                        <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
                        <span className="text-sm font-bold">{localError || error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-primary-900 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder:text-slate-500 font-medium"
                                placeholder="you@student.edu"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-primary-900">Password</label>
                            <Link
                                to="/forgot-password"
                                className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors outline-none focus-visible:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder:text-slate-500 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="premium-button w-full flex items-center justify-center py-3.5 px-4 outline-none focus-visible:ring-4 focus-visible:ring-primary-100 disabled:opacity-75"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Sign In"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 outline-none focus-visible:underline">
                        Create an account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
