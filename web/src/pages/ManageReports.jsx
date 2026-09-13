import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import {
    Loader2, Database, ShieldAlert, CheckCircle, XCircle,
    Eye, X, MapPin, Calendar, Clock, Tag, User, Image as ImageIcon,
    FileText, AlertCircle, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────────────────────── */
/*  Status badge                                                    */
/* ─────────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        active: { cls: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Review' },
        resolved: { cls: 'bg-green-50 text-green-700 border-green-200', label: 'Closed' },
        removed: { cls: 'bg-rose-50  text-rose-700  border-rose-200', label: 'Dismissed' },
        closed: { cls: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Closed' },
    };
    const { cls, label } = map[status] || { cls: 'bg-slate-100 text-slate-500 border-slate-200', label: status };
    return (
        <span className={`px-3 py-1 border font-extrabold text-[10px] tracking-widest uppercase rounded-md ${cls}`}>
            {label}
        </span>
    );
};

/* ─────────────────────────────────────────────────────────────── */
/*  Detail drawer / modal                                           */
/* ─────────────────────────────────────────────────────────────── */
const ReportDetailModal = ({ report, onClose, onStatusChange, actionLoading }) => {
    if (!report) return null;

    const backendBase = 'http://localhost:5000';
    const images = report.images || [];

    const Field = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
            <div className="mt-0.5 text-primary-500">
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-800 break-words">{value || '—'}</p>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {/* Overlay */}
            <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Slide-in panel */}
            <motion.aside
                key="panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${report.type === 'lost' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                {report.type}
                            </span>
                            <StatusBadge status={report.status} />
                        </div>
                        <h2 className="text-xl font-extrabold text-primary-900 mt-1">{report.itemName}</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Case ID: <span className="font-mono text-slate-700">{report._id}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Images */}
                    {images.length > 0 && (
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" /> Evidence / Photos ({images.length})
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {images.map((img, idx) => (
                                    <a
                                        key={idx}
                                        href={`${backendBase}${img.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square block"
                                    >
                                        <img
                                            src={`${backendBase}${img.url}`}
                                            alt={img.originalName || `Evidence ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                                            <p className="text-white text-[9px] font-semibold truncate">{img.originalName || `Photo ${idx + 1}`}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {images.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="text-xs font-semibold text-slate-400">No photos uploaded</p>
                        </div>
                    )}

                    {/* Reporter Info */}
                    <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary-400 mb-3 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Reporter Details
                        </p>
                        <p className="text-sm font-bold text-primary-900">{report.userId?.name || 'Unknown'}</p>
                        <p className="text-xs font-semibold text-primary-600 mt-0.5">{report.userId?.email || 'No email'}</p>
                    </div>

                    {/* Core Fields */}
                    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                        <Field icon={FileText} label="Description" value={report.description} />
                        <Field icon={Tag} label="Category" value={report.categoryId?.name} />
                        <Field
                            icon={MapPin}
                            label="Location"
                            value={[report.locationId?.name, report.locationId?.building, report.locationId?.area].filter(Boolean).join(' · ')}
                        />
                        <Field icon={Calendar} label="Date of Incident" value={report.date ? new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                        <Field icon={Clock} label="Time" value={report.time || 'Not specified'} />
                        <Field
                            icon={AlertCircle}
                            label="Identifying Characteristics"
                            value={report.identifyingCharacteristics?.length > 0
                                ? report.identifyingCharacteristics.join(', ')
                                : 'None listed'}
                        />
                    </div>

                    {/* Timestamps */}
                    <div className="text-xs text-slate-400 font-medium space-y-1 pt-2">
                        <p>Filed: {new Date(report.createdAt).toLocaleString('en-IN')}</p>
                        {report.updatedAt !== report.createdAt && (
                            <p>Last updated: {new Date(report.updatedAt).toLocaleString('en-IN')}</p>
                        )}
                    </div>
                </div>

                {/* Footer — action buttons */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-2">
                    {report.status !== 'active' && (
                        <button
                            disabled={actionLoading === report._id}
                            onClick={() => onStatusChange(report._id, 'active')}
                            className="flex-1 px-3 py-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                            Set Active
                        </button>
                    )}
                    {report.status !== 'resolved' && (
                        <button
                            disabled={actionLoading === report._id}
                            onClick={() => onStatusChange(report._id, 'resolved')}
                            className="flex-1 px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-xs font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                            {actionLoading === report._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            Close Case
                        </button>
                    )}
                    {report.status !== 'removed' && (
                        <button
                            disabled={actionLoading === report._id}
                            onClick={() => onStatusChange(report._id, 'removed')}
                            className="flex-1 px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                            <XCircle className="w-3.5 h-3.5" /> Dismiss
                        </button>
                    )}
                </div>
            </motion.aside>
        </AnimatePresence>
    );
};

/* ─────────────────────────────────────────────────────────────── */
/*  Main page                                                       */
/* ─────────────────────────────────────────────────────────────── */
const ManageReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const fetchReports = useCallback(async () => {
        try {
            const res = await api.get('/reports?limit=500');
            setReports(res.data.data.reports);
        } catch (error) {
            toast.error('Failed to load platform cases');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    const updateStatus = async (id, status) => {
        setActionLoading(id);
        try {
            await api.patch(`/reports/${id}`, { status });
            toast.success(`Case updated to ${status}`);
            setReports(prev => prev.map(r => r._id === id ? { ...r, status } : r));
            if (selectedReport?._id === id) setSelectedReport(prev => ({ ...prev, status }));
        } catch (error) {
            toast.error(`Failed to update to ${status}`);
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = reports.filter(r => {
        if (search && !r.itemName.toLowerCase().includes(search.toLowerCase()) && !(r.userId?.name || '').toLowerCase().includes(search.toLowerCase())) return false;
        if (filterType && r.type !== filterType) return false;
        if (filterStatus && r.status !== filterStatus) return false;
        return true;
    });

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <>
            <div className="max-w-7xl mx-auto pb-12 font-sans">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-6">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Database className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">Case Management</h1>
                        <p className="text-slate-600 font-medium mt-1">Control active platform property tracking cases.</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-2xl font-extrabold text-primary-900">{reports.length}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Cases</p>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-5">
                    <div className="relative flex-1 min-w-[180px]">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by item or reporter..."
                            className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder:text-slate-400"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                        <option value="">All Types</option>
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="resolved">Resolved</option>
                        <option value="removed">Removed</option>
                    </select>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="premium-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] tracking-widest font-extrabold text-slate-500">
                                    <th className="p-4">Target Asset</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Reporter</th>
                                    <th className="p-4">Filed</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((report) => (
                                    <tr key={report._id} className="hover:bg-primary-50/30 transition-colors group">
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedReport(report)}
                                                className="text-left group/btn"
                                            >
                                                <p className="font-bold text-primary-900 group-hover/btn:text-primary-600 transition-colors flex items-center gap-1">
                                                    {report.itemName}
                                                    {(report.images?.length > 0) && (
                                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded ml-1">
                                                            <ImageIcon className="w-2.5 h-2.5" /> {report.images.length}
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-[11px] font-bold uppercase tracking-wider text-primary-600 mt-0.5">{report.categoryId?.name}</p>
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[11px] font-extrabold uppercase tracking-widest ${report.type === 'lost' ? 'text-amber-600' : 'text-green-600'}`}>
                                                {report.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-bold text-primary-900">{report.userId?.name || 'Unknown'}</p>
                                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{report.userId?.email || 'N/A'}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs font-semibold text-slate-600">{new Date(report.createdAt).toLocaleDateString('en-IN')}</p>
                                            <p className="text-[10px] text-slate-400">{new Date(report.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={report.status} />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 text-[10px] font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View
                                                </button>
                                                {report.status !== 'resolved' && (
                                                    <button
                                                        disabled={actionLoading === report._id}
                                                        onClick={() => updateStatus(report._id, 'resolved')}
                                                        className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-green-50 text-green-700 border border-transparent hover:border-green-200 hover:bg-green-100 text-[10px] font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> Close
                                                    </button>
                                                )}
                                                {report.status !== 'removed' && (
                                                    <button
                                                        disabled={actionLoading === report._id}
                                                        onClick={() => updateStatus(report._id, 'removed')}
                                                        className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-transparent hover:border-rose-200 hover:bg-rose-100 text-[10px] font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> Dismiss
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-16 text-center text-slate-500 font-extrabold tracking-widest text-[11px] uppercase bg-slate-50">
                                            {reports.length === 0 ? 'Database Empty. No cases on file.' : 'No cases match your filters.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Detail panel */}
            <AnimatePresence>
                {selectedReport && (
                    <ReportDetailModal
                        report={selectedReport}
                        onClose={() => setSelectedReport(null)}
                        onStatusChange={updateStatus}
                        actionLoading={actionLoading}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ManageReports;
