import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, User, Mail, Lock, ShieldAlert, KeyRound, CheckCircle, MapPin } from 'lucide-react';
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
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="max-w-md w-full premium-card p-8 sm:p-10 bg-white"
            >
                <div className="text-center mb-10 flex flex-col items-center">
                    {step === 1 && (
                        <div className="bg-primary-600 text-white p-2.5 rounded-xl mb-6 shadow-sm">
                            <MapPin className="h-6 w-6" />
                        </div>
                    )}
                    <h2 className="text-3xl font-extrabold text-primary-900 tracking-tight">
                        {step === 1 && 'Create Account'}
                        {step === 2 && 'Verify Identity'}
                        {step === 3 && 'Verification Complete'}
                    </h2>
                    <p className="text-slate-600 mt-2 font-medium">
                        {step === 1 && 'Join CampusFind to secure your belongings.'}
                        {step === 2 && `A 6-digit code was sent to your email.`}
                        {step === 3 && 'Welcome to the platform.'}
                    </p>
                </div>

                {(error || localError) && step !== 3 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                        <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
                        <span className="text-sm font-bold">{localError || error}</span>
                    </div>
                )}

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSignup} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-primary-900 mb-2">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><User className="h-5 w-5" /></div>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder:text-slate-500 font-medium" placeholder="John Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-primary-900 mb-2">Student Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Mail className="h-5 w-5" /></div>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder:text-slate-500 font-medium" placeholder="you@student.edu" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-primary-900 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Lock className="h-5 w-5" /></div>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder:text-slate-500 font-medium" placeholder="••••••••" />
                                    </div>
                                </div>

                                <button type="submit" disabled={isLoading} className="premium-button w-full flex items-center justify-center py-3.5 px-4 outline-none focus-visible:ring-4 focus-visible:ring-primary-100 disabled:opacity-75 mt-4">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Verification Code"}
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerify} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-extrabold text-primary-900 mb-4 text-center">Enter 6-Digit Code</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><KeyRound className="h-6 w-6" /></div>
                                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 text-center tracking-[0.75em] text-3xl font-black bg-slate-50 border-2 border-slate-200 rounded-xl text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                                            placeholder="••••••" maxLength={6} />
                                    </div>
                                    <p className="text-xs text-center text-slate-500 mt-4 font-bold uppercase tracking-wider">Please check your email for the code.</p>
                                </div>

                                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-slate-900 bg-zinc-900 border border-zinc-200 text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all disabled:opacity-75 shadow-sm mt-4">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-extrabold text-primary-900 mb-2">Email Verified Successfully</h3>
                                <p className="text-slate-600 font-medium mb-8">Your uniquely generated platform handle is:</p>

                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-10 shadow-inner">
                                    <span className="text-3xl font-black text-primary-600 tracking-tight">@{generatedUsername}</span>
                                </div>

                                <button onClick={() => navigate('/dashboard')} className="premium-button w-full flex items-center justify-center py-4 px-4 outline-none focus-visible:ring-4 focus-visible:ring-primary-100 shadow-md">
                                    Enter Platform Dashboard
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {step === 1 && (
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 outline-none focus-visible:underline">
                            Sign in securely
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Register;
