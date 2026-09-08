import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Database, ShieldAlert, CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchReports = async () => {
        try {
            // Since role is admin, getting /reports returns ALL reports unconditionally across all user scopes.
            const res = await api.get('/reports?limit=500');
            setReports(res.data.data.reports);
        } catch (error) {
            toast.error("Failed to load platform cases");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const updateStatus = async (id, status) => {
        setActionLoading(id);
        try {
            await api.patch(`/reports/${id}`, { status });
            toast.success(`Case updated to ${status}`);
            fetchReports();
        } catch (error) {
            toast.error(`Failed to update to ${status}`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'active': return <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-xs tracking-wider uppercase rounded-md">Review</span>;
            case 'resolved': return <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs tracking-wider uppercase rounded-md">Closed</span>;
            case 'removed': return <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs tracking-wider uppercase rounded-md">Dismissed</span>;
            default: return <span className="px-3 py-1 bg-slate-500/20 text-slate-400 font-semibold text-xs tracking-wider uppercase rounded-md">{status}</span>;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto text-white">
            <div className="mb-8 flex items-center gap-3">
                <Database className="w-8 h-8 text-indigo-500" />
                <div>
                    <h1 className="text-3xl font-black text-white font-serif">Case Management</h1>
                    <p className="text-slate-400">Absolute administrative control over all active campus property tracking cases.</p>
                </div>
            </div>

            <div className="premium-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 uppercase text-xs tracking-widest font-bold">
                            <th className="p-4 text-slate-400">Target Asset</th>
                            <th className="p-4 text-slate-400">Type</th>
                            <th className="p-4 text-slate-400">Client / Submitter</th>
                            <th className="p-4 text-slate-400">Status</th>
                            <th className="p-4 text-slate-400 text-right">Moderator Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {reports.map((report) => (
                            <motion.tr
                                key={report._id}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="group hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="p-4">
                                    <p className="font-bold text-slate-200">{report.itemName}</p>
                                    <p className="text-xs text-slate-500 font-sans tracking-tight">{report.categoryId?.name}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs font-black uppercase tracking-widest ${report.type === 'lost' ? 'text-amber-400' : 'text-emerald-400'}`}>{report.type}</span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <p className="text-sm font-medium">{report.userId?.name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">{report.userId?.email || 'N/A'}</p>
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={report.status} />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {report.status !== 'active' && (
                                            <button
                                                disabled={actionLoading === report._id}
                                                onClick={() => updateStatus(report._id, 'active')}
                                                className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                                            >
                                                Put Under Review
                                            </button>
                                        )}
                                        {report.status !== 'resolved' && (
                                            <button
                                                disabled={actionLoading === report._id}
                                                onClick={() => updateStatus(report._id, 'resolved')}
                                                className="px-3 py-1.5 rounded-lg flex items-center gap-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircle className="w-3 h-3" /> Close Case
                                            </button>
                                        )}
                                        {report.status !== 'removed' && (
                                            <button
                                                disabled={actionLoading === report._id}
                                                onClick={() => updateStatus(report._id, 'removed')}
                                                className="px-3 py-1.5 rounded-lg flex items-center gap-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                                            >
                                                <XCircle className="w-3 h-3" /> Dismiss
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold tracking-widest text-sm uppercase">
                                    Database Empty. No cases on file.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ManageReports;
