import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, MapPin, Search, Cpu, Sparkles, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-16 pb-20 pt-8 max-w-6xl mx-auto"
        >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center flex flex-col items-center mt-12 relative z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Next-Generation Spatial Matching</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
                    <span className="text-white block">Find what you lost.</span>
                    <span className="premium-text-gradient block mt-2">Faster than ever.</span>
                </h1>

                <p className="text-lg md:text-2xl text-slate-400 max-w-3xl font-sans font-light mb-12">
                    A smart, centralized semantic resolution system for recovering belongings on campus. Register items and let our predictive AI match them instantly.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link to="/report/lost" className="premium-button text-lg px-8 py-4 shadow-[0_0_40px_rgba(100,80,250,0.3)]">
                        Report Missing Item
                    </Link>
                    <Link to="/report/found" className="text-white text-lg px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all">
                        Register Found Item
                    </Link>
                </div>
            </motion.div>

            {/* Bento Grid Features */}
            <div className="bento-grid mt-12">
                <motion.div variants={itemVariants} className="col-span-12 md:col-span-7 premium-card p-10 relative overflow-hidden group min-h-[300px] flex flex-col justify-end">
                    <div className="absolute right-[-10%] top-[-10%] opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <Cpu className="w-80 h-80 text-indigo-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                            <Sparkles className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Automated Telemetry</h2>
                        <p className="text-slate-400 max-w-md font-sans">Our semantic engine analyzes characteristics, temporal bounds, and spatial data to autonomously link lost reports with found inventory.</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="col-span-12 md:col-span-5 premium-card p-10 relative overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/20">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Secure Resolution</h2>
                    <p className="text-slate-400 font-sans mb-8">Administrators strictly monitor algorithmic suggestions to guarantee a secure return of property to verified students without false-positives.</p>

                    <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors">
                        Access Nexus <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>

            {/* Stats / Status Bar */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {[
                    { label: "Active Nodes", value: "24", icon: <Activity className="h-6 w-6 text-indigo-400" /> },
                    { label: "Lost Index", value: "14", icon: <Search className="h-6 w-6 text-amber-400" /> },
                    { label: "Found Inventory", value: "10", icon: <MapPin className="h-6 w-6 text-emerald-400" /> },
                    { label: "Resolved Matches", value: "3", icon: <Hexagon className="h-6 w-6 text-purple-400" /> }
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="premium-card p-8 flex flex-col items-center justify-center text-center group"
                    >
                        <div className="p-4 rounded-full bg-white/5 border border-white/5 mb-4 group-hover:bg-white/10 transition-colors">
                            {stat.icon}
                        </div>
                        <h3 className="text-4xl font-black text-white mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Home;
