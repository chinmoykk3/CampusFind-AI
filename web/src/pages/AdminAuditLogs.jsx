import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, ShieldCheck, Activity, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/admin/audit');
            setLogs(res.data.data);
        } catch (error) {
            toast.error("Failed to load audit logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleExport = async () => {
        try {
            const res = await api.get('/admin/audit/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'campusfind_audit_logs.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Forensic CSV exported.");
        } catch (error) {
            toast.error("Failed to export logs");
        }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    const EntityBadge = ({ type }) => {
        switch (type) {
            case 'user': return <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded font-extrabold uppercase tracking-widest text-[10px]">User Node</span>;
            case 'category': return <span className="text-green-600 bg-mint-50 px-2 py-1 rounded font-extrabold uppercase tracking-widest text-[10px]">Category</span>;
            case 'location': return <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded font-extrabold uppercase tracking-widest text-[10px]">Location Node</span>;
            case 'report': return <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded font-extrabold uppercase tracking-widest text-[10px]">Report</span>;
            default: return <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded font-extrabold uppercase tracking-widest text-[10px]">{type}</span>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12 font-sans">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex-shrink-0">
                        <ShieldCheck className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">System Audit Log</h1>
                        <p className="text-slate-600 font-medium mt-1">Immutable ledger recording all administrative actions.</p>
                    </div>
                </div>
                <button onClick={handleExport} className="premium-button flex items-center gap-2 py-2.5 px-5 whitespace-nowrap">
                    <Download className="w-4 h-4" /> Download Forensic CSV
                </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="premium-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] tracking-widest font-extrabold text-slate-500">
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">Administrator</th>
                                <th className="p-4">Action Invoked</th>
                                <th className="p-4">Target Resource</th>
                                <th className="p-4 text-right">Sys Info</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 whitespace-nowrap">
                                        <p className="font-bold text-primary-900 text-sm tracking-tight">{new Date(log.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5 tracking-tight">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-bold text-primary-900">{log.actorUserId?.name || 'Unknown'}</p>
                                        <p className="text-[11px] font-semibold text-primary-600 mt-0.5">{log.actorUserId?.email || 'N/A'}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-bold text-slate-600">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="mb-1"><EntityBadge type={log.entityType} /></div>
                                        <p className="text-[11px] font-bold text-slate-500 truncate font-mono bg-slate-50 px-1 py-0.5 rounded inline-block border border-slate-200">ID: {log.entityId.slice(-8)}</p>
                                    </td>
                                    <td className="p-4 text-right">
                                        <p className="text-[11px] font-bold text-slate-500 font-mono" title={log.userAgent}>{log.ipAddress || 'Internal'}</p>
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center text-slate-500 font-extrabold tracking-widest text-[11px] uppercase bg-slate-50">
                                        No administrative actions have been logged yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminAuditLogs;
