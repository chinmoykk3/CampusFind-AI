import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Search, Filter, MapPin, Tag, Calendar, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const MyReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, lost, found

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/reports');
                setReports(res.data.data.reports || []);
            } catch (error) {
                toast.error("Failed to load your reports");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(report => {
        if (filter === 'all') return true;
        return report.type === filter;
    });

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto pb-12 font-sans">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Database className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">My Reports</h1>
                        <p className="text-slate-600 font-medium mt-1">Manage and track the status of items you've submitted to the platform.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm w-fit">
                    <Filter className="w-4 h-4 text-slate-500 ml-2 shrink-0" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none pl-1 pr-6 py-1.5 appearance-none"
                    >
                        <option value="all">All Reports</option>
                        <option value="lost">Lost Items</option>
                        <option value="found">Found Items</option>
                    </select>
                </div>
            </motion.div>

            {filteredReports.length === 0 ? (
                <div className="premium-card bg-slate-50 border border-slate-200 border-dashed p-16 text-center rounded-2xl shadow-sm">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No reports found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredReports.map((report, idx) => (
                        <motion.div
                            key={report._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="premium-card bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 hover:-translate-y-1 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${report.type === 'lost'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-mint-50 text-green-700 border-green-200'
                                    }`}>
                                    {report.type}
                                </span>
                                <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest border ${report.status === 'resolved'
                                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                                        : 'bg-slate-100 border-slate-200 text-slate-600'
                                    }`}>
                                    {report.status}
                                </span>
                            </div>

                            <h3 className="font-extrabold text-xl text-primary-900 mb-2 group-hover:text-primary-600 transition-colors">{report.itemName}</h3>
                            <p className="text-sm text-slate-600 font-medium line-clamp-2 h-10 mb-6 leading-relaxed">
                                "{report.description}"
                            </p>

                            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <Tag className="w-4 h-4 text-primary-500" />
                                    <span className="truncate">{report.categoryId?.name || 'Unknown Category'}</span>
                                </p>
                                <p className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <MapPin className="w-4 h-4 text-amber-500" />
                                    <span className="truncate">{report.locationId?.name || 'Unknown Location'}</span>
                                </p>
                                <p className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                    <Calendar className="w-4 h-4 text-green-500" />
                                    <span>{new Date(report.date).toLocaleDateString()}</span>
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReports;
