import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Radio, MapPin, Tag, Clock, Eye, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const PublicWall = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchPublicReports = async () => {
            try {
                // Fetch public anonymized stream of open reports
                const res = await api.get('/reports/public');
                setReports(res.data.data);
            } catch (error) {
                toast.error("Failed to connect to the global stream");
            } finally {
                setLoading(false);
            }
        };
        fetchPublicReports();
    }, []);

    const filteredReports = reports.filter(r => filter === 'all' || r.type === filter);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto pt-8 pb-20 px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Live Global Feed</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">The Wall</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mt-3 font-sans text-lg">
                        An anonymized, real-time telemetry stream of all documented missing and found items currently active traversing the campus grid.
                    </p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                    {['all', 'lost', 'found'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
            ) : filteredReports.length === 0 ? (
                <div className="premium-card p-12 text-center border-dashed">
                    <p className="text-slate-500 font-black uppercase tracking-widest">No active anomalies detected on the grid.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports.map((report, idx) => (
                        <motion.div key={report._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="premium-card relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
                        >
                            {/* Accent line */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${report.type === 'lost' ? 'bg-amber-500' : 'bg-emerald-500'}`} />

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1 ${report.type === 'lost' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                        }`}>
                                        {report.type === 'lost' ? <Eye className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                        {report.type}
                                    </div>
                                    <span className="text-xs font-mono text-slate-400">ID: {report._id.slice(-6)}</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-1 group-hover:text-indigo-500 transition-colors">
                                    {report.itemName}
                                </h3>

                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <Tag className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <span className="truncate">{report.categoryId?.name || 'Uncategorized'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <span className="truncate">{report.locationId?.name || 'Unknown Zone'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <span>{new Date(report.date).toLocaleDateString()} at {report.time}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default PublicWall;
