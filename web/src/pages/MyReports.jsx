import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Search, Filter } from 'lucide-react';
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

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">My Reports</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage and track the status of items you've reported.</p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl ring-1 ring-slate-900/5 shadow-sm">
                    <Filter className="w-5 h-5 text-slate-400 ml-2" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer outline-none pl-1 pr-6 py-1"
                    >
                        <option value="all">All Reports</option>
                        <option value="lost">Lost Items</option>
                        <option value="found">Found Items</option>
                    </select>
                </div>
            </div>

            {filteredReports.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border-white/20">
                    <p className="text-slate-500">No reports found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredReports.map(report => (
                        <motion.div
                            key={report._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm ring-1 ring-slate-900/5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${report.type === 'lost' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {report.type}
                                </span>
                                <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 capitalize">
                                    {report.status}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{report.itemName}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 h-10">
                                {report.description}
                            </p>

                            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                    {report.categoryId?.name || 'Unknown Category'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                    {report.locationId?.name || 'Unknown Location'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                    {new Date(report.date).toLocaleDateString()}
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
