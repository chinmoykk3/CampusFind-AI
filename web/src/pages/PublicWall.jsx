import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import {
    Loader2, Radio, MapPin, Tag, Clock, Search,
    ShieldCheck, FileText, AlertCircle, Image as ImageIcon, X, ChevronRight, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/* ─────────────────────────────────────────────────────────────── */
/*  Report Detail Modal                                             */
/* ─────────────────────────────────────────────────────────────── */
const ReportModal = ({ report, onClose }) => {
    if (!report) return null;

    const images = report.images || [];
    const [activeImg, setActiveImg] = useState(0);

    return (
        <AnimatePresence>
            <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md mb-2 ${report.type === 'lost'
                                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-100 text-green-700 border border-green-200'
                                    }`}>
                                    {report.type === 'lost' ? <Search className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                    {report.type}
                                </span>
                                <h2 className="text-xl font-extrabold text-slate-900">{report.itemName}</h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Case reference: <span className="font-mono">{report._id?.slice(-8)}</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0 shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Image gallery */}
                        {images.length > 0 ? (
                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5" /> Photos ({images.length})
                                </p>
                                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 relative">
                                    <img
                                        src={`${BACKEND}${images[activeImg]?.url}`}
                                        alt={images[activeImg]?.originalName || 'Item photo'}
                                        className="w-full h-full object-cover"
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                {images.length > 1 && (
                                    <div className="flex gap-2 mt-2">
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveImg(i)}
                                                className={`w-14 h-14 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${i === activeImg ? 'border-primary-500 shadow-sm' : 'border-slate-200 opacity-50 hover:opacity-80'}`}
                                            >
                                                <img src={`${BACKEND}${img.url}`} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 py-5 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <ImageIcon className="w-5 h-5 text-slate-300" />
                                <span className="text-xs font-semibold text-slate-400">No photos uploaded</span>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Description
                            </p>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                                {report.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Identifying characteristics */}
                        {report.identifyingCharacteristics?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5" /> Identifying Features
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {report.identifyingCharacteristics.map((c, i) => (
                                        <span key={i} className="text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-full">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Category</p>
                                <p className="text-sm font-bold text-slate-800">{report.categoryId?.name || '—'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                                <p className="text-sm font-bold text-slate-800 leading-snug">
                                    {[report.locationId?.name, report.locationId?.building].filter(Boolean).join(' · ') || '—'}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                                <p className="text-sm font-bold text-slate-800">
                                    {report.date ? new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</p>
                                <p className="text-sm font-bold text-slate-800">{report.time || 'Not specified'}</p>
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-400 font-medium pt-1">
                            Filed {new Date(report.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ─────────────────────────────────────────────────────────────── */
/*  Wall Card                                                       */
/* ─────────────────────────────────────────────────────────────── */
const WallCard = ({ report, onClick }) => {
    const firstImage = report.images?.[0];
    const hasImage = !!firstImage;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="premium-card bg-white relative overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            {/* Type accent stripe */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${report.type === 'lost' ? 'bg-amber-400' : 'bg-emerald-500'}`} />

            {/* Photo or placeholder */}
            <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                {hasImage ? (
                    <img
                        src={`${BACKEND}${firstImage.url}`}
                        alt={report.itemName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={e => { e.target.parentNode.classList.add('image-error'); e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                        <ImageIcon className="w-10 h-10 text-slate-200 mb-1" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">No Photo</span>
                    </div>
                )}

                {/* Image count badge */}
                {report.images?.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                        +{report.images.length - 1} photos
                    </span>
                )}
            </div>

            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${report.type === 'lost'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-green-700 border-green-200'
                        }`}>
                        {report.type === 'lost' ? <Search className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {report.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{report._id?.slice(-6)}</span>
                </div>

                <h3 className="text-lg font-extrabold text-primary-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {report.itemName}
                </h3>

                {report.description && (
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">
                        {report.description}
                    </p>
                )}

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Tag className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                        <span className="truncate">{report.categoryId?.name || 'Uncategorized'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="truncate">
                            {[report.locationId?.name, report.locationId?.building].filter(Boolean).join(' · ') || 'Unknown Zone'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>
                            {report.date ? new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            {report.time && ` · ${report.time}`}
                        </span>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
                    View Full Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────────────────────── */
/*  Main Page                                                       */
/* ─────────────────────────────────────────────────────────────── */
const PublicWall = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPublicReports = async () => {
            try {
                const res = await api.get('/reports/public');
                setReports(res.data.data);
            } catch {
                toast.error('Failed to connect to the global stream');
            } finally {
                setLoading(false);
            }
        };
        fetchPublicReports();
    }, []);

    const filtered = reports.filter(r => {
        if (filter !== 'all' && r.type !== filter) return false;
        if (search && !r.itemName.toLowerCase().includes(search.toLowerCase()) &&
            !(r.description || '').toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="bg-slate-50 min-h-screen">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto pt-10 pb-20 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 mb-4 shadow-sm">
                            <Radio className="w-4 h-4 text-green-600 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-green-800">Live Global Feed</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-900 tracking-tight">Campus Wall</h1>
                        <p className="text-slate-600 max-w-xl mt-3 font-medium leading-relaxed">
                            Real-time feed of all active lost & found reports on campus. Click any card to view full details.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-slate-500">
                            <span className="text-2xl font-extrabold text-primary-700">{filtered.length}</span> active reports
                        </span>
                    </div>
                </div>

                {/* Search + Filter bar */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by item name or description..."
                        className="flex-1 min-w-[220px] pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder:text-slate-400 shadow-sm"
                    />
                    <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                        {['all', 'lost', 'found'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${filter === f
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 p-16 text-center rounded-2xl">
                        <Radio className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                            {reports.length === 0 ? 'No active reports on campus right now.' : 'No reports match your search.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((report) => (
                            <WallCard
                                key={report._id}
                                report={report}
                                onClick={() => setSelectedReport(report)}
                            />
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Detail modal */}
            <AnimatePresence>
                {selectedReport && (
                    <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PublicWall;
