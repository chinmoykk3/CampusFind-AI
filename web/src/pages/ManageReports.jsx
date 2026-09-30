import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import {
    Loader2, Database, ShieldAlert, CheckCircle, XCircle,
    Eye, X, MapPin, Calendar, Clock, Tag, User, Image as ImageIcon,
    FileText, AlertCircle, ChevronRight, QrCode, Search,
    ChevronDown, ChevronUp, ChevronLeft
} from 'lucide-react';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

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

    const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
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

                    {/* PHYSICAL SMART TAG FOR ADMIMS */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 mt-6 print-this">
                        <div className="bg-white p-2 rounded-lg">
                            <QRCode value={`${window.location.origin}/report/${report._id}`} size={64} />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                <QrCode className="w-3.5 h-3.5" /> Inventory Smart Tag
                            </p>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                Print this tag and attach it to the physical item in your locker. Users can scan it offline to instantly pull up this asset.
                            </p>
                        </div>
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

    // Custom Filters
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

    const filtered = useMemo(() => reports.filter(r => {
        if (search && !r.itemName.toLowerCase().includes(search.toLowerCase()) && !(r.userId?.name || '').toLowerCase().includes(search.toLowerCase())) return false;
        if (filterType && r.type !== filterType) return false;
        if (filterStatus && r.status !== filterStatus) return false;
        return true;
    }), [reports, search, filterType, filterStatus]);

    const columns = useMemo(() => [
        columnHelper.accessor('itemName', {
            header: 'Target Asset',
            cell: info => {
                const report = info.row.original;
                return (
                    <button onClick={() => setSelectedReport(report)} className="text-left group/btn outline-none">
                        <p className="font-bold text-primary-900 dark:text-stone-100 group-hover/btn:text-primary-600 transition-colors flex items-center gap-1">
                            {report.itemName}
                            {(report.images?.length > 0) && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-1.5 py-0.5 rounded ml-1 transition-colors">
                                    <ImageIcon className="w-2.5 h-2.5" /> {report.images.length}
                                </span>
                            )}
                        </p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary-600 mt-0.5">{report.categoryId?.name}</p>
                    </button>
                );
            }
        }),
        columnHelper.accessor('type', {
            header: 'Type',
            cell: info => (
                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${info.getValue() === 'lost' ? 'text-amber-600' : 'text-green-600'}`}>
                    {info.getValue()}
                </span>
            )
        }),
        columnHelper.accessor(row => row.userId?.name, {
            id: 'reporter',
            header: 'Reporter',
            cell: info => {
                const report = info.row.original;
                return (
                    <>
                        <p className="text-sm font-bold text-primary-900 dark:text-stone-100">{report.userId?.name || 'Unknown'}</p>
                        <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-0.5">{report.userId?.email || 'N/A'}</p>
                    </>
                );
            }
        }),
        columnHelper.accessor('createdAt', {
            header: 'Filed',
            cell: info => {
                const date = new Date(info.getValue());
                return (
                    <>
                        <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">{date.toLocaleDateString('en-IN')}</p>
                        <p className="text-[10px] text-stone-400 dark:text-stone-500">{date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </>
                );
            },
            sortingFn: 'datetime'
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => <StatusBadge status={info.getValue()} />
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right w-full">Actions</div>,
            cell: info => {
                const report = info.row.original;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setSelectedReport(report)}
                            className="px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/50 text-[10px] font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1"
                        >
                            <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        {report.status !== 'resolved' && (
                            <button
                                disabled={actionLoading === report._id}
                                onClick={() => updateStatus(report._id, 'resolved')}
                                className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-transparent hover:border-green-200 dark:hover:border-green-800/50 hover:bg-green-100 dark:hover:bg-green-900/50 text-[10px] font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                            >
                                <CheckCircle className="w-3.5 h-3.5" /> Close
                            </button>
                        )}
                        {report.status !== 'removed' && (
                            <button
                                disabled={actionLoading === report._id}
                                onClick={() => updateStatus(report._id, 'removed')}
                                className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-[10px] font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                            >
                                <XCircle className="w-3.5 h-3.5" /> Dismiss
                            </button>
                        )}
                    </div>
                );
            }
        })
    ], [actionLoading]);

    const table = useReactTable({
        data: filtered,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 8 }
        }
    });

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <>
            <div className="max-w-7xl mx-auto pb-12 font-sans px-4 sm:px-6 lg:px-8 pt-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-6 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                            <Database className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-primary-900 dark:text-white tracking-tight">Case Management</h1>
                            <p className="text-stone-600 dark:text-stone-400 font-medium mt-1">Control active platform property tracking cases.</p>
                        </div>
                    </div>
                    <div className="md:ml-auto md:text-right hidden sm:block">
                        <p className="text-2xl font-extrabold text-primary-900 dark:text-stone-100">{reports.length}</p>
                        <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Total Cases</p>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-5">
                    <div className="relative flex-1 min-w-[200px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-stone-400" />
                        </div>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by asset or investigator..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#09090b] border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500 placeholder:text-stone-400 transition-colors"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="px-4 py-2.5 bg-white dark:bg-[#09090b] border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500 transition-colors"
                    >
                        <option value="">All Types</option>
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-white dark:bg-[#09090b] border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500 transition-colors"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active (Review)</option>
                        <option value="resolved">Resolved</option>
                        <option value="removed">Dismissed</option>
                    </select>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#09090b] rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden transition-colors">
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800 transition-colors">
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className={`p-4 font-bold text-[11px] uppercase tracking-widest text-stone-500 dark:text-stone-400 ${header.column.getCanSort() ? 'cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 select-none' : ''}`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <div className={`flex items-center gap-1 ${header.id === 'actions' ? 'justify-end' : ''}`}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && (
                                                        <span className="w-4 flex justify-center">
                                                            {{
                                                                asc: <ChevronUp className="w-4 h-4 text-primary-600" />,
                                                                desc: <ChevronDown className="w-4 h-4 text-primary-600" />,
                                                            }[header.column.getIsSorted()] ?? null}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="hover:bg-primary-50/30 dark:hover:bg-stone-900/40 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="p-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="p-16 text-center text-stone-500 font-extrabold tracking-widest text-[11px] uppercase bg-stone-50 dark:bg-stone-900/30">
                                            {reports.length === 0 ? 'Database Empty. No cases on file.' : 'No cases match your filters.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/20">
                        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 font-medium">
                            <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
                            <span className="bg-white dark:bg-stone-800 px-2 py-1 rounded shadow-sm border border-stone-200 dark:border-stone-700 text-xs">Total: {table.getPrePaginationRowModel().rows.length}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
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
