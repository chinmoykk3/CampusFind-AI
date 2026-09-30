import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Bell, BellOff, CheckCheck, FileText, Zap, Info, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const TypeBadge = ({ type }) => {
    const map = {
        report_update: { cls: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Report' },
        new_report: { cls: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Report' },
        potential_match: { cls: 'bg-amber-50 text-amber-600 border-amber-100', label: 'AI Match' },
        system: { cls: 'bg-purple-50 text-purple-600 border-purple-100', label: 'System' },
    };
    const { cls, label } = map[type] || { cls: 'bg-slate-50 text-slate-500 border-slate-200', label: type };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase tracking-widest ${cls}`}>{label}</span>;
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);

    const fetchAndMarkRead = useCallback(async () => {
        try {
            const res = await api.get('/notifications');
            const { notifications: n } = res.data.data;
            setNotifications(n || []);

            // Mark all unread as read
            const hasUnread = (n || []).some(x => !x.isRead);
            if (hasUnread) {
                await api.put('/notifications/mark-all-read').catch(() => {
                    // Fallback: mark each individually
                });
                setNotifications(prev => prev.map(x => ({ ...x, isRead: true })));
            }
        } catch {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAndMarkRead(); }, [fetchAndMarkRead]);

    const markOneRead = async (id) => {
        const n = notifications.find(x => x._id === id);
        if (!n || n.isRead) return;
        try {
            await api.put(`/${id}/read`);
            setNotifications(prev => prev.map(x => x._id === id ? { ...x, isRead: true } : x));
        } catch { /* silent */ }
    };

    const handleMarkAll = async () => {
        setMarking(true);
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => prev.map(x => ({ ...x, isRead: true })));
            toast.success('All marked as read');
        } catch {
            toast.error('Failed to mark all as read');
        } finally {
            setMarking(false);
        }
    };

    const unread = notifications.filter(n => !n.isRead).length;

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-50 rounded-xl border border-primary-100">
                        <Bell className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-primary-900">Notifications</h1>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                            {unread > 0 ? `${unread} unread` : 'All caught up'}
                        </p>
                    </div>
                </div>
                {unread > 0 && (
                    <button onClick={handleMarkAll} disabled={marking}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm disabled:opacity-50">
                        {marking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                        Mark all read
                    </button>
                )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="premium-card bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl">

                {notifications.length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-slate-400">
                        <BellOff className="w-12 h-12 text-slate-200 mb-3" />
                        <p className="text-sm font-bold uppercase tracking-widest">Nothing here yet</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">Notifications about your reports and AI matches will appear here.</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        <ul className="divide-y divide-slate-100">
                            {notifications.map(n => (
                                <motion.li key={n._id} layout
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    onClick={() => markOneRead(n._id)}
                                    className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/60 hover:bg-blue-50 border-l-4 border-l-blue-400' : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="mt-1.5 flex-shrink-0">
                                        {n.isRead
                                            ? <span className="w-2 h-2 rounded-full bg-slate-200 block" />
                                            : <span className="w-2 h-2 rounded-full bg-blue-500 block animate-pulse" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TypeBadge type={n.type} />
                                        </div>
                                        <p className={`text-sm mb-0.5 ${!n.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {n.title}
                                        </p>
                                        <p className="text-sm text-slate-500 leading-snug">{n.message}</p>
                                        <p className="text-[10px] font-semibold text-slate-400 mt-1.5">
                                            {new Date(n.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {n.isRead
                                        ? <span className="self-start pt-1 text-[10px] font-extrabold uppercase text-slate-300 flex items-center gap-1 flex-shrink-0"><CheckCheck className="w-3 h-3" /> Read</span>
                                        : <span className="self-start pt-1 text-[10px] font-extrabold uppercase text-blue-500 flex-shrink-0">New</span>
                                    }
                                </motion.li>
                            ))}
                        </ul>
                    </AnimatePresence>
                )}
            </motion.div>
        </div>
    );
};

export default Notifications;
