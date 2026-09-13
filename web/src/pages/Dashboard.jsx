import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Eye, ShieldCheck, Sparkles, ArrowRight, Activity, Clock, MapPin, Search, HandHeart } from 'lucide-react';
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
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    if (loading) return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-12 max-w-5xl mx-auto w-full">
            <div className="animate-pulse flex flex-col space-y-8 w-full">
                <div className="flex flex-col space-y-3">
                    <div className="w-1/3 h-10 bg-slate-200 rounded-lg"></div>
                    <div className="w-1/2 h-4 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                    <div className="col-span-12 md:col-span-8 bg-slate-200 h-[300px] rounded-2xl"></div>
                    <div className="col-span-12 md:col-span-4 bg-slate-200 h-[300px] rounded-2xl"></div>
                    <div className="col-span-12 bg-slate-200 h-64 rounded-2xl mt-4"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="mb-8 flex flex-col items-start text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-900 mb-3 tracking-tight">
                        Welcome back, {user?.name?.split(' ')[0] || 'Student'}.
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-medium">
                        Your personal dashboard for managing active reports, reviewing AI matches, and returning items safely on campus.
                    </p>
                </motion.div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">

                    {/* Quick Report Actions */}
                    <motion.div variants={itemVariants} className="col-span-12 md:col-span-8 premium-card p-6 sm:p-8 flex flex-col justify-between min-h-[300px] shadow-sm border border-slate-200 bg-white">
                        <div>
                            <h2 className="text-2xl font-extrabold text-primary-900 mb-2">Report an Item</h2>
                            <p className="text-slate-600 font-medium">Log a missing item or help someone by indexing a found object into our CampusFind map.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <Link to="/report/lost" className="group flex items-center justify-between bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 p-5 rounded-2xl transition-all shadow-sm hover:shadow-md flex-1 outline-none">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-100 border border-amber-200 flex items-center justify-center rounded-xl shadow-sm">
                                        <Search className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-extrabold text-primary-900">I Lost Something</p>
                                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 mt-1">File a report</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                            </Link>

                            <Link to="/report/found" className="group flex items-center justify-between bg-white border border-slate-200 hover:border-green-300 hover:bg-mint-50 p-5 rounded-2xl transition-all shadow-sm hover:shadow-md flex-1 outline-none">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 border border-green-200 flex items-center justify-center rounded-xl shadow-sm">
                                        <ShieldCheck className="w-6 h-6 text-green-600 hidden sm:block" />
                                        <HandHeart className="w-6 h-6 text-green-600 sm:hidden" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-extrabold text-primary-900">I Found Something</p>
                                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-green-600 mt-1">Register item</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* AI Match Stats Box */}
                    <motion.div variants={itemVariants} className="col-span-12 md:col-span-4 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group bg-zinc-900 border border-zinc-800 rounded-[8px] text-white shadow-md">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-zinc-700/20 rounded-full blur-2xl"></div>
                        <div className="relative z-10 w-full">
                            <div className="w-16 h-16 mx-auto rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 shadow-sm">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-6xl font-black mb-2 tracking-tighter text-white">{stats.matches}</h3>
                            <p className="text-[11px] tracking-widest uppercase font-extrabold text-zinc-400">AI Matches Found</p>

                            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between w-full">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-white">{stats.lost}</span>
                                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400 mt-1">Lost</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-white">{stats.found}</span>
                                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400 mt-1">Found</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Status Tracker */}
                    <motion.div variants={itemVariants} className="col-span-12 premium-card p-6 sm:p-8 shadow-sm border border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                                    <Activity className="w-5 h-5 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-extrabold text-primary-900">Recent Campus Activity</h3>
                            </div>
                            <Link to="/wall" className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline outline-none">
                                View Full Log
                            </Link>
                        </div>

                        {recentReports.length === 0 ? (
                            <div className="py-16 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                <p className="text-[11px] uppercase tracking-widest font-extrabold text-slate-500">No recent activity detected on campus.</p>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {recentReports.map(report => (
                                    <li key={report._id} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl border ${report.type === 'lost' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-mint-50 border-green-200 text-green-700'}`}>
                                                {report.type === 'lost' ? <Search className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary-900 group-hover:text-primary-600 transition-colors line-clamp-1">{report.itemName}</p>
                                                <p className="text-[11px] text-slate-500 font-extrabold tracking-wide uppercase flex items-center gap-1 mt-1.5">
                                                    <Clock className="w-3 h-3 text-slate-500" /> {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-md shrink-0 border ${report.status === 'resolved' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                            report.type === 'lost' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-mint-50 text-green-700 border-green-200'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
