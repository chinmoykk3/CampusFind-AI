import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Users, Database, ShieldAlert, TrendingUp, Search, MapPin, Activity, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // The /admin endpoint returns { success: true, data: { stats: {...}, recentReports, recentMatches } }
                const response = await api.get('/admin/dashboard');
                setDashboardData(response.data.data.stats);
            } catch (error) {
                console.error("Failed to load admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    if (!dashboardData) return null;

    const { users, reports, matches } = dashboardData;

    const pieColors = ['#f43f5e', '#3b82f6']; // Rose for lost, Blue for found
    const matchColors = ['#8b5cf6', '#10b981', '#f43f5e']; // Purple, Emerald, Rose

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-12 text-white font-sans max-w-7xl mx-auto space-y-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-black text-white font-serif tracking-tight">System Analytics</h1>
                    <p className="text-slate-400">Campus-wide aggregated metrics. Strictly confidential.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/admin/users" className="premium-button text-sm px-5 py-2.5 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Manage Users
                    </Link>
                    <Link to="/admin/matches" className="premium-button text-sm px-5 py-2.5 flex items-center gap-2 border border-indigo-500/30">
                        <ShieldAlert className="w-4 h-4 text-indigo-400" /> Review AI Matches
                    </Link>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard title="Total Registered Users" value={users.total} sub={`${users.active} Active`} icon={<Users className="w-5 h-5 text-blue-400" />} />
                <KPICard title="Total Reports" value={reports.total} sub={`${reports.active} Open`} icon={<Database className="w-5 h-5 text-indigo-400" />} />
                <KPICard title="Recovery Rate" value={`${reports.recoveryRate}%`} sub={`${reports.resolved} Resolved`} icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} />
                <KPICard title="Match Engine Success" value={`${matches.successRate}%`} sub={`${matches.confirmed} Confirmed`} icon={<CheckCircle className="w-5 h-5 text-purple-400" />} />
            </div>

            {/* Charts Row 1 */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Reports Over Time */}
                <div className="md:col-span-2 premium-card p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-white hover:text-indigo-300 transition-colors">Incident Volume (14 Days)</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={reports.byTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Match Pipeline */}
                <div className="premium-card p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-white">Match Resolution Target</h3>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Potential', value: matches.potential },
                                        { name: 'Confirmed', value: matches.confirmed },
                                        { name: 'Rejected', value: matches.rejected }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {matchColors.map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black">{matches.potential + matches.confirmed + matches.rejected}</span>
                            <span className="text-xs text-slate-400">Total Flags</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Reports By Category */}
                <div className="premium-card p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-white">Incident Clusters (Category)</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports.byCategory} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} cursor={{ fill: '#ffffff05' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reports By Location */}
                <div className="premium-card p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-white">Spatial Heatmap (Location)</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports.byLocation}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }} cursor={{ fill: '#ffffff05' }} />
                                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

const KPICard = ({ title, value, sub, icon }) => (
    <div className="premium-card p-5 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium text-slate-400">{title}</h4>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
        </div>
        <div className="mt-4">
            <h2 className="text-3xl font-black text-white tracking-tight">{value}</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">{sub}</p>
        </div>
    </div>
);

export default AdminDashboard;
