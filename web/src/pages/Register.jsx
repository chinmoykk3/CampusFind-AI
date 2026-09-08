import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, User, Mail, Lock, ShieldAlert, KeyRound, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [localError, setLocalError] = useState('');
    const [generatedUsername, setGeneratedUsername] = useState('');

    const { register, verifyOtp, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (!name || !email || !password) return setLocalError('Please fill out all fields');
        if (password.length < 8) return setLocalError('Password must be at least 8 characters');

        try {
            await register(name, email, password);
            setStep(2);
        } catch (err) { }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (!otp) return setLocalError('Please enter the verification code');

        try {
            const res = await verifyOtp(email, otp);
            setGeneratedUsername(res.data.user.username);
            setStep(3); // Show the success confirmation step with username
        } catch (err) { }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="max-w-md w-full mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl ring-1 ring-slate-900/5 mt-16"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {step === 1 && 'Create Account'}
                    {step === 2 && 'Verify Identity'}
                    {step === 3 && 'Verification Complete'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {step === 1 && 'Join CampusFind to report items'}
                    {step === 2 && `A 6-digit code was sent to ${email}`}
                    {step === 3 && 'Welcome to the platform.'}
                </p>
            </div>

            {(error || localError) && step !== 3 && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{localError || error}</span>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User className="h-5 w-5" /></div>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="John Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail className="h-5 w-5" /></div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="you@student.edu" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock className="h-5 w-5" /></div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="••••••••" />
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-70">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Verification Code"}
                        </button>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Enter 6-Digit Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><KeyRound className="h-5 w-5" /></div>
                                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-4 text-center tracking-[1em] text-2xl font-black bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="••••••" maxLength={6} />
                            </div>
                            <p className="text-xs text-center text-slate-500 mt-3 font-semibold uppercase tracking-wider">Please check your email for the intercept code.</p>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-70">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                        </button>
                    </motion.form>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Email Verified Successfully</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Your uniquely generated handle is:</p>

                        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-8">
                            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">@{generatedUsername}</span>
                        </div>

                        <button onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-all">
                            Enter Platform
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {step === 1 ? 'Already have an account? ' : 'Change your mind? '}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Sign in
                </Link>
            </div>
        </motion.div>
    );
};

export default Register;
