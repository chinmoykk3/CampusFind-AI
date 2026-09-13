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

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
    if (!dashboardData) return null;

    const { users, reports, matches } = dashboardData;

    const matchColors = ['#0066FF', '#22c55e', '#f59e0b']; // Primary, Mint, Amber

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-12 text-slate-800 font-sans max-w-5xl mx-auto space-y-6">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">System Analytics</h1>
                    <p className="text-slate-600 mt-2 font-medium">Campus-wide aggregated metrics. Strictly confidential.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/admin/users" className="secondary-button text-sm px-5 py-2.5 flex items-center gap-2 shadow-sm bg-white hover:bg-slate-50 border border-slate-200">
                        <Users className="w-4 h-4 text-slate-500" /> Manage Users
                    </Link>
                    <Link to="/admin/matches" className="premium-button text-sm px-5 py-2.5 flex items-center gap-2 shadow-sm border border-primary-600 text-slate-900 hover:bg-primary-700 hover:text-slate-900 pointer">
                        <ShieldAlert className="w-4 h-4 text-primary-200" /> Review AI Matches
                    </Link>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <KPICard title="Total Registered Users" value={users.total} sub={`${users.active} Active`} icon={<Users className="w-6 h-6 text-primary-600" />} color="bg-primary-50 border-primary-100" />
                <KPICard title="Total Reports" value={reports.total} sub={`${reports.active} Open`} icon={<Database className="w-6 h-6 text-blue-600" />} color="bg-blue-50 border-blue-100" />
                <KPICard title="Recovery Rate" value={`${reports.recoveryRate}%`} sub={`${reports.resolved} Resolved`} icon={<TrendingUp className="w-6 h-6 text-green-600" />} color="bg-mint-50 border-green-100" />
                <KPICard title="Match Engine Success" value={`${matches.successRate}%`} sub={`${matches.confirmed} Confirmed`} icon={<CheckCircle className="w-6 h-6 text-amber-600" />} color="bg-amber-50 border-amber-100" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
                {/* Reports Over Time */}
                <div className="md:col-span-2 premium-card bg-white border border-slate-200 p-8 h-80 flex flex-col relative overflow-hidden shadow-sm">
                    <h3 className="text-xl font-extrabold mb-4 text-primary-900 border-b border-slate-100 pb-3">Incident Volume (14 Days)</h3>
                    <div className="flex-1 w-full relative z-10 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={reports.byTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} fontWeight={600} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} fontWeight={600} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#0066FF', fontWeight: 800 }} />
                                <Area type="monotone" dataKey="count" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Match Pipeline */}
                <div className="premium-card bg-white border border-slate-200 p-8 h-80 flex flex-col relative overflow-hidden shadow-sm">
                    <h3 className="text-xl font-extrabold mb-4 text-primary-900 border-b border-slate-100 pb-3">Match Resolution Target</h3>
                    <div className="flex-1 relative z-10 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Potential', value: matches.potential },
                                        { name: 'Confirmed', value: matches.confirmed },
                                        { name: 'Rejected', value: matches.rejected }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {matchColors.map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: 800 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-6">
                            <span className="text-3xl font-black text-primary-900">{matches.potential + matches.confirmed + matches.rejected}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Total Flags</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Reports By Category */}
                <div className="premium-card bg-white border border-slate-200 p-6 h-80 flex flex-col shadow-sm">
                    <h3 className="text-lg font-extrabold mb-6 text-primary-900">Incident Clusters (Category)</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports.byCategory} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} fontWeight={600} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#0066FF" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reports By Location */}
                <div className="premium-card bg-white border border-slate-200 p-6 h-80 flex flex-col shadow-sm">
                    <h3 className="text-lg font-extrabold mb-6 text-primary-900">Spatial Heatmap (Location)</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports.byLocation}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} fontWeight={600} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} fontWeight={600} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

const KPICard = ({ title, value, sub, icon, color }) => (
    <div className={`premium-card bg-white border border-slate-200 p-6 relative overflow-hidden group shadow-sm transition-transform hover:-translate-y-1 duration-300`}>
        <div className="flex justify-between items-start mb-4">
            <h4 className="text-sm font-bold text-slate-600">{title}</h4>
            <div className={`p-2.5 rounded-xl border ${color} transition-colors`}>
                {icon}
            </div>
        </div>
        <div className="mt-4">
            <h2 className="text-4xl font-black text-primary-900 tracking-tight">{value}</h2>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">{sub}</p>
        </div>
    </div>
);

export default AdminDashboard;
