import React, { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, User, Mail, Hexagon, Fingerprint, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const { user, logout } = useAuthStore();

    // For 3D card tilt effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left - width / 2) / 10);
        mouseY.set((clientY - top - height / 2) / 10);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-8 pb-20 px-4 md:px-0">
            <div className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Fingerprint className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Identity Matrix</span>
                </div>
                <h1 className="text-5xl font-extrabold text-slate-900 font-display tracking-tight">Security Clearance</h1>
                <p className="text-slate-500 mt-2">Manage your verified encrypted identity and telemetry access.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* 3D Holographic ID Card */}
                <div
                    className="relative perspective-1000 w-full"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div
                        style={{
                            rotateX: useMotionTemplate`calc(${mouseY} * -1deg)`,
                            rotateY: useMotionTemplate`calc(${mouseX} * 1deg)`,
                            transformStyle: "preserve-3d"
                        }}
                        className="premium-card p-0 h-[400px] w-full flex flex-col justify-between relative group cursor-crosshair overflow-visible border-slate-200"
                    >
                        {/* Dynamic Holographic Shine */}
                        <motion.div
                            className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                                background: useMotionTemplate`radial-gradient(600px circle at calc(${mouseX} * -10px + 50%) calc(${mouseY} * -10px + 50%), rgba(255,255,255,0.1), transparent 40%)`
                            }}
                        />

                        {/* Top ID Header */}
                        <div className="p-8 border-b border-slate-200 flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
                            <div>
                                <Hexagon className="h-8 w-8 text-indigo-500 mb-2" fill="currentColor" fillOpacity={0.2} />
                                <span className="font-bold text-xl tracking-tight text-slate-900 font-display">
                                    Campus<span className="text-indigo-400">Find</span>
                                </span>
                            </div>
                            <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified Level 1
                            </div>
                        </div>

                        {/* Body Details */}
                        <div className="p-8 flex-1" style={{ transform: "translateZ(40px)" }}>
                            <div className="flex gap-6 items-center">
                                {/* Photo Avatar Placeholder */}
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                                        <span className="text-3xl font-black text-slate-900">{user?.name?.charAt(0)}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-1">Operative Handle</p>
                                    <h2 className="text-2xl font-black text-slate-900 font-display break-all leading-none">
                                        @{user?.username || user?.name?.split(' ')[0].toLowerCase() + '123'}
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500 mt-2">{user?.name}</p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 font-mono text-sm">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">AUTH.EMAIL</span>
                                    <span className="text-emerald-400">{user?.email}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">ASSIGNED.ROLE</span>
                                    <span className="text-indigo-300 uppercase">{user?.role}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-slate-500">SECURITY.HASH</span>
                                    <span className="text-slate-600 truncate max-w-[150px]">{user?.id || '***************'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Scanline Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none rounded-[24px] opacity-30"></div>
                    </motion.div>
                </div>

                {/* Account Settings Panel */}
                <div className="flex flex-col gap-6">
                    <div className="premium-card p-8">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2 mb-2">
                                <Activity className="w-5 h-5 text-indigo-400" /> Account Management
                            </h3>

                            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                Your account is cryptographically secured. Authentication mechanisms are locked to the primary email vector.
                            </p>

                            <Link to="/report/new" className="premium-button text-center w-full py-3 text-sm font-bold shadow-lg shadow-sm">
                                Dispatch New Telemetry Report
                            </Link>

                            <Link to="/my-reports" className="bg-white/5 hover:bg-white/10 border border-slate-200 text-slate-900 text-center w-full py-3 rounded-xl text-sm font-bold transition-all mt-2">
                                Access Archived Reports
                            </Link>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-red-500/5 group">
                        <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-4">Danger Zone</h3>
                        <p className="text-sm text-slate-500 mb-6 font-medium">Permanently disconnect your session from the Nexus grid.</p>
                        <button
                            onClick={logout}
                            className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-slate-900 transition-all rounded-xl py-3 w-full font-bold text-sm"
                        >
                            Terminate Active Session
                        </button>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default UserProfile;
