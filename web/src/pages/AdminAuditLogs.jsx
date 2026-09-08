import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, ShieldCheck, Activity } from 'lucide-react';
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

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    const EntityBadge = ({ type }) => {
        switch (type) {
            case 'user': return <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">User Node</span>;
            case 'category': return <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Category Logic</span>;
            case 'location': return <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">Spatial Node</span>;
            case 'report': return <span className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">Report Case</span>;
            default: return <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{type}</span>;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto text-white">
            <div className="mb-8 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-indigo-500" />
                <div>
                    <h1 className="text-3xl font-black text-white font-serif tracking-tight">System Audit Log</h1>
                    <p className="text-slate-400">Immutable ledger recording all administrative actions executed on the CampusFind-AI platform.</p>
                </div>
            </div>

            <div className="premium-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 uppercase text-xs tracking-widest font-bold">
                            <th className="p-4 text-slate-400">Timestamp</th>
                            <th className="p-4 text-slate-400">Administrator</th>
                            <th className="p-4 text-slate-400">Action Invoked</th>
                            <th className="p-4 text-slate-400">Target Resource</th>
                            <th className="p-4 text-slate-400 text-right">Sys Info</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                            <tr key={log._id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 whitespace-nowrap">
                                    <p className="font-bold text-slate-200 text-sm tracking-tight">{new Date(log.createdAt).toLocaleDateString()}</p>
                                    <p className="text-xs text-slate-500 font-sans tracking-tight">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-black text-white">{log.actorUserId?.name || 'Unknown'}</p>
                                    <p className="text-xs text-indigo-400">{log.actorUserId?.email || 'N/A'}</p>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs font-semibold text-slate-300">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <EntityBadge type={log.entityType} />
                                    <p className="text-xs font-mono text-slate-500 truncate mt-1">ID: {log.entityId}</p>
                                </td>
                                <td className="p-4 text-right">
                                    <p className="text-xs text-slate-500 font-mono" title={log.userAgent}>{log.ipAddress || 'Internal'}</p>
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold tracking-widest text-sm uppercase">
                                    No administrative actions have been logged yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AdminAuditLogs;
