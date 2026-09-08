import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { PackageSearch, Eye, ShieldCheck, Sparkles, ArrowRight, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({ lost: 0, found: 0, matches: 0, total: 0 });
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [lostRes, foundRes, matchRes, allRes] = await Promise.all([
                    api.get('/reports?type=lost&limit=1'),
                    api.get('/reports?type=found&limit=1'),
                    api.get('/matching'),
                    api.get('/reports?limit=5')
                ]);

                setStats({
                    lost: lostRes.data.data.pagination.total,
                    found: foundRes.data.data.pagination.total,
                    total: lostRes.data.data.pagination.total + foundRes.data.data.pagination.total,
                    matches: matchRes.data.data.length
                });

                setRecentReports(allRes.data.data.reports);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
            className="max-w-6xl mx-auto pt-8 pb-20"
        >
            <motion.div variants={itemVariants} className="mb-12 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">CampusFind AI Engine Active</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold premium-text-gradient mb-6 tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0] || 'Student'}.
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-sans font-light">
                    Your personal nexus for returning lost utility and discovering found items powered by intelligent spatial mapping.
                </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="bento-grid">

                {/* Main Action Card */}
                <motion.div variants={itemVariants} className="col-span-12 md:col-span-8 premium-card p-10 flex flex-col justify-between min-h-[320px]">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Report an Item</h2>
                        <p className="text-slate-400 max-w-md">Instantly index a lost or found item into our semantic matching matrix.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link to="/report/lost" className="group flex items-center justify-between bg-white/10 hover:bg-white/15 border border-white/10 p-5 rounded-2xl transition-all flex-1">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl"><Eye className="w-6 h-6" /></div>
                                <div className="text-left">
                                    <p className="font-bold text-white">I Lost Something</p>
                                    <p className="text-xs tracking-wider uppercase text-slate-400 mt-1">File a report</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                        </Link>

                        <Link to="/report/found" className="group flex items-center justify-between bg-white/10 hover:bg-white/15 border border-white/10 p-5 rounded-2xl transition-all flex-1">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
                                <div className="text-left">
                                    <p className="font-bold text-white">I Found Something</p>
                                    <p className="text-xs tracking-wider uppercase text-slate-400 mt-1">Register item</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                        </Link>
                    </div>
                </motion.div>

                {/* AI Match Stats Box */}
                <motion.div variants={itemVariants} className="col-span-12 md:col-span-4 premium-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(120,100,250,0.3)]">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-6xl font-bold text-white mb-2">{loading ? '-' : stats.matches}</h3>
                        <p className="text-sm tracking-widest uppercase font-semibold text-indigo-400">AI Matches Found</p>
                    </div>
                </motion.div>

                {/* Status Tracker */}
                <motion.div variants={itemVariants} className="col-span-12 premium-card p-8 bg-gradient-to-r from-black/40 to-transparent">
                    <div className="flex items-center gap-3 mb-8">
                        <Activity className="w-5 h-5 text-slate-400" />
                        <h3 className="text-xl font-bold text-white">Live Activity Stream</h3>
                    </div>

                    {recentReports.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                            <p className="text-sm uppercase tracking-widest font-semibold font-sans">No telemetry detected. Stream empty.</p>
                        </div>
                    ) : (
                        <ul className="grid md:grid-cols-2 gap-4">
                            {recentReports.map(report => (
                                <li key={report._id} className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ${report.type === 'lost' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{report.itemName}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-sans">
                                                <Clock className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/10 backdrop-blur-md">
                                        {report.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
