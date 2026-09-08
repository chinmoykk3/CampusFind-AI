import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Mail, Lock, ShieldAlert } from 'lucide-react';
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl ring-1 ring-slate-900/5 mt-16"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your CampusFind account</p>
            </div>

            {(error || localError) && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{localError || error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="h-5 w-5" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="you@student.edu"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all cursor-pointer"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Sign up
                </Link>
            </div>
        </motion.div>
    );
};

export default Login;
