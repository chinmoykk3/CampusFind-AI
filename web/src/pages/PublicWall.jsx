import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Radio, MapPin, Tag, Clock, Search, ShieldCheck } from 'lucide-react';
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
        <div className="bg-slate-50 min-h-screen">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto pt-10 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 mb-4 shadow-sm">
                            <Radio className="w-4 h-4 text-green-600 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-green-800">Live Global Feed</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-900 tracking-tight">Campus Wall</h1>
                        <p className="text-slate-600 max-w-2xl mt-4 font-medium text-lg leading-relaxed">
                            An anonymized, real-time telemetry stream mapping all active missing and found items traversing the campus infrastructure.
                        </p>
                    </div>

                    <div className="flex bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm w-fit shrink-0">
                        {['all', 'lost', 'found'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${filter === f
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
                ) : filteredReports.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 p-16 text-center rounded-2xl shadow-sm">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No active anomalies detected on the grid.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReports.map((report, idx) => (
                            <motion.div key={report._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                className="premium-card bg-white relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Accent line */}
                                <div className={`absolute top-0 left-0 w-full h-1.5 ${report.type === 'lost' ? 'bg-amber-400' : 'bg-zinc-900 border border-zinc-200 text-white'}`} />

                                <div className="p-6 sm:p-8">
                                    <div className="flex justify-between items-center mb-5">
                                        <div className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${report.type === 'lost'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-emerald-50 text-green-800 border-green-200'
                                            }`}>
                                            {report.type === 'lost' ? <Search className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                            {report.type}
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">ID: {report._id.slice(-6)}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-primary-900 mb-6 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                        {report.itemName}
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                                                <Tag className="w-4 h-4 text-primary-600" />
                                            </div>
                                            <span className="truncate">{report.categoryId?.name || 'Uncategorized'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                                                <MapPin className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <span className="truncate">{report.locationId?.name || 'Unknown Zone'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                                <Clock className="w-4 h-4 text-primary-500" />
                                            </div>
                                            <span>{new Date(report.date).toLocaleDateString()} {report.time && `at ${report.time}`}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PublicWall;
