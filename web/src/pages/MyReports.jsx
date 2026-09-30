import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import {
    Loader2, Search, MapPin, Tag, Calendar, Database,
    Image as ImageIcon, Trash2, Eye, X, FileText,
    AlertCircle, Clock, CheckCircle2, AlertTriangle, Filter, QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/* ─── Status badge ──────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        active: { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <AlertTriangle className="w-3 h-3" />, label: 'Active' },
        resolved: { cls: 'bg-green-50 text-green-700 border-green-200', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Resolved' },
        removed: { cls: 'bg-rose-50  text-rose-700  border-rose-200', icon: <X className="w-3 h-3" />, label: 'Removed' },
        closed: { cls: 'bg-slate-100 text-slate-600 border-slate-200', icon: <X className="w-3 h-3" />, label: 'Closed' },
    };
    const { cls, icon, label } = map[status] || { cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: null, label: status };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${cls}`}>
            {icon}{label}
        </span>
    );
};

/* ─── Detail Modal ──────────────────────────────────────────── */
const DetailModal = ({ report, onClose }) => {
    const [activeImg, setActiveImg] = useState(0);
    if (!report) return null;
    const images = report.images || [];

    return (
        <AnimatePresence>
            <motion.div
                key="overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.93, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 20 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`p-6 border-b border-slate-100 ${report.type === 'lost' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${report.type === 'lost' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-green-700 border-green-200'}`}>
                                        {report.type}
                                    </span>
                                    <StatusBadge status={report.status} />
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-900">{report.itemName}</h2>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{report._id}</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shadow-sm flex-shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Images */}
                        {images.length > 0 ? (
                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5" /> Your Photos ({images.length})
                                </p>
                                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                                    <img src={`${BACKEND}${images[activeImg]?.url}`} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                </div>
                                {images.length > 1 && (
                                    <div className="flex gap-2 mt-2">
                                        {images.map((img, i) => (
                                            <button key={i} onClick={() => setActiveImg(i)}
                                                className={`w-14 h-14 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${i === activeImg ? 'border-primary-500' : 'border-slate-200 opacity-50 hover:opacity-80'}`}>
                                                <img src={`${BACKEND}${img.url}`} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 py-5 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <ImageIcon className="w-5 h-5 text-slate-300" />
                                <span className="text-xs font-semibold text-slate-400">No photos uploaded with this report</span>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Description</p>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                                {report.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Characteristics */}
                        {report.identifyingCharacteristics?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Identifying Features</p>
                                <div className="flex flex-wrap gap-2">
                                    {report.identifyingCharacteristics.map((c, i) => (
                                        <span key={i} className="text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-full">{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: Tag, label: 'Category', value: report.categoryId?.name },
                                { icon: MapPin, label: 'Location', value: [report.locationId?.name, report.locationId?.building].filter(Boolean).join(' · ') },
                                { icon: Calendar, label: 'Date', value: report.date ? new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                                { icon: Clock, label: 'Time', value: report.time || 'Not specified' },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><Icon className="w-3 h-3" />{label}</p>
                                    <p className="text-sm font-bold text-slate-800 leading-snug">{value || '—'}</p>
                                </div>
                            ))}
                        </div>

                        {report.status === 'resolved' && report.resolvedAt && (
                            <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <p className="text-xs font-semibold text-green-700">
                                    Case resolved on {new Date(report.resolvedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    {' '}— photos are automatically deleted 24 hours after resolution.
                                </p>
                            </div>
                        )}

                        {/* Smart Tag */}
                        <div className="mt-4 p-5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-5 shadow-sm">
                            <div>
                                <p className="text-xs font-extrabold uppercase tracking-widest text-primary-600 mb-1 flex items-center gap-1.5">
                                    <QrCode className="w-3.5 h-3.5" /> Smart Tag
                                </p>
                                <p className="text-sm font-medium text-slate-600 leading-snug">
                                    Print this QR code and attach it to your actual item. If someone scans it, it instantly opens this report page in CampusFind!
                                </p>
                            </div>
                            <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-sm flex-shrink-0">
                                <QRCode value={`${window.location.origin}/report/${report._id}`} size={72} />
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-400 font-medium">
                            Filed {new Date(report.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ─── Main Page ─────────────────────────────────────────────── */
const MyReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedReport, setSelected] = useState(null);

    const fetchReports = useCallback(async () => {
        try {
            const res = await api.get('/reports?limit=100');
            setReports(res.data.data.reports || []);
        } catch {
            toast.error('Failed to load your reports');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this report? This cannot be undone.')) return;
        setDeleting(id);
        try {
            await api.delete(`/reports/${id}`);
            toast.success('Report deleted');
            setReports(prev => prev.filter(r => r._id !== id));
            if (selectedReport?._id === id) setSelected(null);
        } catch {
            toast.error('Failed to delete report');
        } finally {
            setDeleting(null);
        }
    };

    const filtered = reports.filter(r => filter === 'all' || r.type === filter);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <>
            <div className="max-w-7xl mx-auto pb-12">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <Database className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">My Reports</h1>
                            <p className="text-slate-500 font-medium mt-0.5">
                                {reports.length} report{reports.length !== 1 ? 's' : ''} filed by you
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
                        <Filter className="w-4 h-4 text-slate-400 ml-2" />
                        {['all', 'lost', 'found'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${filter === f ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 bg-white p-16 text-center rounded-2xl">
                        <Database className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                            {reports.length === 0 ? "You haven't filed any reports yet." : 'No reports match your filter.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((report, idx) => {
                            const firstImg = report.images?.[0];
                            return (
                                <motion.div key={report._id}
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="premium-card bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                >
                                    {/* Photo / placeholder */}
                                    <div className="relative h-36 bg-slate-100 overflow-hidden">
                                        {firstImg ? (
                                            <img src={`${BACKEND}${firstImg.url}`} alt={report.itemName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={e => { e.target.style.display = 'none'; }} />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                                                <ImageIcon className="w-8 h-8 text-slate-200 mb-1" />
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">No Photo</span>
                                            </div>
                                        )}
                                        {/* Type stripe */}
                                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${report.type === 'lost' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                        {/* Image count */}
                                        {report.images?.length > 1 && (
                                            <span className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                                +{report.images.length - 1}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${report.type === 'lost' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-green-700 border-green-200'}`}>
                                                {report.type}
                                            </span>
                                            <StatusBadge status={report.status} />
                                        </div>

                                        <h3 className="font-extrabold text-lg text-primary-900 mb-1.5 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                            {report.itemName}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed min-h-[40px]">
                                            {report.description || 'No description provided.'}
                                        </p>

                                        <div className="space-y-1.5 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                <Tag className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                                                <span className="truncate">{report.categoryId?.name || 'Unknown'}</span>
                                            </p>
                                            <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                                <span className="truncate">{report.locationId?.name || 'Unknown'}</span>
                                            </p>
                                            <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                <Calendar className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                                <span>{report.date ? new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button onClick={() => setSelected(report)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 hover:bg-primary-100 text-[10px] font-extrabold uppercase tracking-wider transition-colors">
                                                <Eye className="w-3.5 h-3.5" /> Details
                                            </button>
                                            <button
                                                disabled={deleting === report._id}
                                                onClick={() => handleDelete(report._id)}
                                                className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-40 flex items-center gap-1"
                                                title="Delete report"
                                            >
                                                {deleting === report._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedReport && (
                    <DetailModal report={selectedReport} onClose={() => setSelected(null)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default MyReports;
