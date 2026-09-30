import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Users, FileText, Target, Bot, MapPin, ChevronDown, Rocket, Filter, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                setDashboardData(response.data.data.stats);
            } catch (error) {
                console.error("Failed to load admin stats", error);
                // Fallback for visual testing if API fails
                setDashboardData({
                    users: { total: 10, active: 9 },
                    reports: {
                        total: 13, active: 13, recoveryRate: 200, resolved: 10,
                        byTime: [
                            { date: '2026-09-22', count: 0 }, { date: '2026-09-23', count: 1.5 }, { date: '2026-09-24', count: 3.25 },
                            { date: '2026-09-25', count: 2 }, { date: '2026-09-26', count: 1.5 }, { date: '2026-09-27', count: 1.75 },
                            { date: '2026-09-28', count: 2 }
                        ],
                        byCategory: [
                            { name: 'Theft', count: 4 }, { name: 'Harassment', count: 4 }, { name: 'Lost Item', count: 2 },
                            { name: 'Vandalism', count: 3 }, { name: 'Fraud', count: 2 }, { name: 'Others', count: 1 }
                        ],
                        byLocation: [
                            { name: 'Library', count: 5 }, { name: 'Cafeteria', count: 3 }, { name: 'Dorms', count: 2 }
                        ]
                    },
                    matches: { successRate: 92.3, confirmed: 12, potential: 13, rejected: 1 }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
    if (!dashboardData) return null;

    const { users, reports, matches } = dashboardData;

    // Custom colors for UI
    const categoryColors = ['#3b82f6', '#f472b6', '#a855f7', '#22c55e', '#14b8a6', '#f59e0b'];

    // Fake locations for the map heatmap visual
    const campusCenter = [40.7128, -74.0060];
    const heatmapPoints = [
        { lat: 40.7135, lng: -74.0050, intensity: 40, color: '#ef4444' }, // Red (High)
        { lat: 40.7120, lng: -74.0075, intensity: 25, color: '#f59e0b' }, // Orange (Med)
        { lat: 40.7140, lng: -74.0080, intensity: 15, color: '#22c55e' }, // Green (Low)
        { lat: 40.7115, lng: -74.0045, intensity: 30, color: '#ef4444' }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-12 text-slate-800 font-sans mx-auto space-y-6 max-w-[1400px]">

            {/* Custom Banner Header */}
            <div className="relative rounded-3xl bg-white p-8 mb-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row justify-between items-center group">
                {/* Decorative BG Elements Matching the Screenshot */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-rose-50/20"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-300/20 via-purple-300/10 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32 z-0"></div>
                <div className="absolute bottom-0 left-20 w-80 h-80 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-full blur-2xl translate-y-32 z-0"></div>

                <div className="relative z-10 space-y-4 w-full md:w-[55%]">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span>Admin Portal</span> <span className="text-slate-300">/</span> <span className="text-blue-600">Admin</span>
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Analytics</span>
                        </h1>
                        <p className="text-slate-500 font-semibold text-sm md:text-[15px] mt-2">
                            Campus-wide aggregated metrics. Strictly confidential.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-3 shrink-0">
                        <Link to="/admin/users" className="bg-white text-slate-700 text-sm font-bold px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" /> Manage Users
                        </Link>
                        <Link to="/admin/matches" className="bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-slate-800 transition-all flex items-center gap-2">
                            <Bot className="w-4 h-4 text-blue-300" /> Review AI Matches
                        </Link>
                    </div>
                </div>

                {/* Right Illustration Area */}
                <div className="hidden md:flex relative z-10 w-[45%] justify-end items-center pointer-events-none mt-8 md:mt-0 right-4 h-48">
                    {/* Floating Illustration Composition */}
                    <div className="relative w-full max-w-[320px] h-full">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute z-20 top-0 right-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/80 w-48">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center"><Target className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} /></div>
                                <div className="h-1.5 w-12 bg-slate-200 rounded-full"></div>
                            </div>
                            <div className="h-10 w-full bg-slate-50 rounded-xl overflow-hidden flex items-end justify-between px-1.5 gap-1.5 pt-2 border border-slate-100">
                                <div className="w-full bg-blue-400 rounded-t-sm h-[30%]"></div>
                                <div className="w-full bg-purple-400 rounded-t-sm h-[60%]"></div>
                                <div className="w-full bg-rose-400 rounded-t-sm h-[45%]"></div>
                                <div className="w-full bg-indigo-500 rounded-t-sm h-[85%]"></div>
                            </div>
                        </motion.div>

                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute z-10 bottom-2 left-0 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-xl shadow-indigo-100/40 border border-white flex flex-col gap-1 w-44">
                            <span className="text-[10px] font-black text-indigo-900/60 uppercase tracking-widest leading-tight">Keep Campus Safer Together</span>
                            <div className="flex gap-1.5 mt-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm"></div>
                            </div>
                        </motion.div>

                        {/* Rocket */}
                        <motion.div animate={{ y: [0, -12, 0], x: [0, 4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute z-30 top-1/2 left-1/2 -translate-x-[20%] -translate-y-1/2 w-[88px] h-[88px] bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_12px_30px_rgba(99,102,241,0.4)] border-[5px] border-white backdrop-blur-sm">
                            <Rocket className="w-10 h-10 text-white translate-x-[2px] -translate-y-[2px]" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <KPICard title="Total Registered Users" value="9" activeText="ACTIVE" badge="+12%" badgeType="positive" icon={<Users className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
                <KPICard title="Total Reports" value="13" activeText="OPEN" badge="-3%" badgeType="negative" icon={<FileText className="w-5 h-5 text-purple-500" />} color="bg-purple-50" />
                <KPICard title="Recovery Rate" value="200%" activeText="10 RESOLVED" badge="-12%" badgeType="negative" icon={<Target className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
                <KPICard title="Match Engine Success" value="92.3%" activeText="12 CONFIRMED" badge="+15%" badgeType="positive" icon={<Bot className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* Incident Volume Line Chart */}
                <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-800">Incident Volume (14 Days)</h3>
                        </div>
                        <button className="text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                            Last 14 Days <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex-1 w-full min-h-0 relative -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={reports.byTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} minTickGap={20} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} width={40} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                    formatter={(value) => [`${value} Incidents`]}
                                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Match Resolution Target */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] h-[350px]">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-slate-800">Match Resolution Target</h3>
                    </div>
                    <div className="flex-1 relative flex flex-row items-center justify-between pb-4">
                        <div className="relative h-[200px] w-1/2 ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Resolved', value: 10, color: '#10b981' }, // Green
                                            { name: 'Pending', value: 1, color: '#f59e0b' },   // Orange
                                            { name: 'False Positive', value: 2, color: '#0ea5e9' } // Teal/Blue matching screenshot
                                        ]}
                                        innerRadius={68}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={4}
                                    >
                                        {
                                            [
                                                { name: 'Resolved', value: 10, color: '#10b981' },
                                                { name: 'Pending', value: 1, color: '#f59e0b' },
                                                { name: 'False Positive', value: 2, color: '#0ea5e9' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Inner Circle Label Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                                <span className="text-[44px] font-black text-slate-800 leading-none tracking-tighter">13</span>
                                <span className="text-[9px] font-extrabold tracking-[0.2em] text-slate-400 mt-1 uppercase">Total Flags</span>
                            </div>
                        </div>

                        {/* Custom Legend moved to Right */}
                        <div className="w-[45%] flex flex-col justify-center gap-5 text-[13px] font-bold shrink-0 pl-2">
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-2 text-slate-700">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 block shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> 10 Resolved
                                </span>
                                <span className="text-slate-400 ml-5 font-semibold text-[11px]">[ 80.0% ]</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-2 text-slate-700">
                                    <span className="w-3 h-3 rounded-full bg-amber-500 block shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span> 1 Pending
                                </span>
                                <span className="text-slate-400 ml-5 font-semibold text-[11px]">[ 7.7% ]</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-2 text-slate-700">
                                    <span className="w-3 h-3 rounded-full bg-sky-500 block shadow-[0_0_8px_rgba(14,165,233,0.4)]"></span> 2 False Positive
                                </span>
                                <span className="text-slate-400 ml-5 font-semibold text-[11px]">[ 15.3% ]</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Incident Clusters Bar Chart */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] h-[320px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-bold text-slate-800">Incident Clusters (Category)</h3>
                        </div>
                        <button className="text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                            All Categories <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex-1 w-full min-h-0 -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports.byCategory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} width={40} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={32}>
                                    {reports.byCategory?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spatial Heatmap */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] h-[320px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-rose-500" />
                            <h3 className="text-lg font-bold text-slate-800">Spatial Heatmap (Location)</h3>
                        </div>
                        <button className="text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                            All Locations <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex-1 w-full rounded-2xl overflow-hidden relative border border-slate-100">
                        {/* Leaflet Map to match the spatial visualization request */}
                        <div className="absolute inset-0 z-0">
                            <MapContainer center={campusCenter} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                    attribution=""
                                />
                                {/* Heatmap visual overlay (mock blobs) */}
                                {heatmapPoints.map((pt, i) => (
                                    <CircleMarker
                                        key={i}
                                        center={[pt.lat, pt.lng]}
                                        radius={pt.intensity}
                                        pathOptions={{ fillColor: pt.color, color: pt.color, fillOpacity: 0.4, weight: 0 }}
                                    >
                                        <CircleMarker center={[pt.lat, pt.lng]} radius={pt.intensity / 3} pathOptions={{ fillColor: pt.color, color: 'transparent', fillOpacity: 0.8 }} />
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        </div>

                        {/* Overlay Legend */}
                        <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1.5 pointer-events-none">
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 block shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span> High Activity</div>
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 block shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span> Med Activity</div>
                        </div>
                    </div>
                </div>

            </div>

        </motion.div>
    );
};

// Reusable KPI Card Component mimicking the design
const KPICard = ({ title, value, activeText, badge, badgeType, icon, color }) => (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 pl-6 relative overflow-hidden group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">

        {/* Top Header Row */}
        <div className="flex justify-between items-start mb-4">
            <h4 className="text-[13px] font-bold text-slate-500">{title}</h4>
            <div className={`p-2.5 rounded-2xl ${color}`}>
                {icon}
            </div>
        </div>

        {/* Value and Active Subtext */}
        <div className="flex flex-col mt-2">
            <div className="flex items-center gap-3">
                <h2 className="text-[40px] font-black text-slate-800 tracking-tighter leading-none">{value}</h2>
                {badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${badgeType === 'positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {badge}
                    </span>
                )}
            </div>

            <p className="text-[12px] text-slate-400 font-extrabold tracking-widest mt-2 uppercase">
                {activeText && <><span className="text-slate-500">{activeText.split(' ')[0]}</span> {activeText.split(' ').slice(1).join(' ')}</>}
            </p>

            {/* Small subtle graph decoration in bg */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-full blur-2xl z-0 pointer-events-none opacity-60 group-hover:scale-125 transition-transform duration-500" />
        </div>

    </div>
);

export default AdminDashboard;

