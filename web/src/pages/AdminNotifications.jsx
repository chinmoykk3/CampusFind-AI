import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { Loader2, BellRing, Send, Volume2, CheckCheck, Bell, FileText, Zap, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [formData, setFormData] = useState({ title: '', message: '' });

    /* ── Fetch + auto-mark-all-read on open ─────────────────────── */
    const fetchAndMarkRead = useCallback(async () => {
        try {
            // Fetch first so we can show unread styling briefly
            const res = await api.get('/notifications/admin');
            setNotifications(res.data.data);

            // Then mark all as read in DB (fire-and-forget style)
            const unread = res.data.data.filter(n => !n.isRead);
            if (unread.length > 0) {
                await api.put('/notifications/admin/mark-all-read');
                // Update local state so "DELIVERED" badges flip to "READ"
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAndMarkRead(); }, [fetchAndMarkRead]);

    /* ── Mark single notification as read on click ──────────────── */
    const markOneRead = async (id) => {
        const target = notifications.find(n => n._id === id);
        if (!target || target.isRead) return; // already read

        try {
            await api.put(`/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch { /* silent */ }
    };

    /* ── Broadcast ───────────────────────────────────────────────── */
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) return toast.error('Title and Message required');
        setIsBroadcasting(true);
        try {
            const result = await api.post('/notifications/broadcast', formData);
            toast.success(result.data.message || 'Priority broadcast sent successfully.');
            setFormData({ title: '', message: '' });
            fetchAndMarkRead();
        } catch {
            toast.error('Failed to execute broadcast protocol.');
        } finally {
            setIsBroadcasting(false);
        }
    };

    /* ── Type badge ──────────────────────────────────────────────── */
    const TypeBadge = ({ type }) => {
        const map = {
            report_update: { cls: 'bg-blue-50 text-blue-600 border-blue-100', icon: <FileText className="w-3 h-3" />, label: 'New Report' },
            new_report: { cls: 'bg-blue-50 text-blue-600 border-blue-100', icon: <FileText className="w-3 h-3" />, label: 'New Report' },
            potential_match: { cls: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Zap className="w-3 h-3" />, label: 'AI Match' },
            system: { cls: 'bg-purple-50 text-purple-600 border-purple-100', icon: <Bell className="w-3 h-3" />, label: 'System' },
        };
        const { cls, icon, label } = map[type] || { cls: 'bg-slate-50 text-slate-500 border-slate-200', icon: <Info className="w-3 h-3" />, label: type };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase tracking-widest ${cls}`}>
                {icon}{label}
            </span>
        );
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto text-slate-900">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <BellRing className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notification Control</h1>
                    <p className="text-slate-500 font-medium mt-0.5">Launch global announcements and oversee real-time AI alerting systems.</p>
                </div>
                {unreadCount === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700"
                    >
                        <CheckCheck className="w-3.5 h-3.5" /> All caught up
                    </motion.div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Broadcast form */}
                <div className="md:col-span-1">
                    <div className="premium-card p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl" />
                        <h3 className="text-base font-extrabold flex items-center gap-2 mb-2 text-slate-800">
                            <Volume2 className="w-5 h-5 text-indigo-500" /> Global Broadcast
                        </h3>
                        <p className="text-sm text-slate-500 mb-5">Push a high-priority system alert to all active student accounts.</p>

                        <form onSubmit={handleBroadcast} className="space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Headline</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all placeholder:text-slate-400"
                                    placeholder="e.g. System Maintenance"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all placeholder:text-slate-400"
                                    placeholder="Type announcement details here..."
                                    rows={4}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isBroadcasting}
                                className="premium-button w-full flex items-center justify-center gap-2 py-3"
                            >
                                {isBroadcasting
                                    ? <Loader2 className="w-5 h-5 animate-spin" />
                                    : <><Send className="w-4 h-4" /> Execute Broadcast</>
                                }
                            </button>
                        </form>
                    </div>
                </div>

                {/* Notification feed */}
                <div className="md:col-span-2 premium-card overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <p className="font-extrabold text-xs uppercase tracking-widest text-slate-500">
                            Live Network Telemetry ({notifications.length})
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Unread
                            <span className="w-2 h-2 rounded-full bg-slate-200 inline-block ml-2" /> Read
                        </div>
                    </div>

                    <ul className="divide-y divide-slate-100 flex-1 overflow-y-auto" style={{ maxHeight: '600px' }}>
                        <AnimatePresence initial={false}>
                            {notifications.map((note) => (
                                <motion.li
                                    key={note._id}
                                    layout
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => markOneRead(note._id)}
                                    className={`flex gap-4 p-4 cursor-pointer transition-colors ${note.isRead
                                            ? 'bg-white hover:bg-slate-50'
                                            : 'bg-blue-50/60 hover:bg-blue-50 border-l-4 border-l-blue-400'
                                        }`}
                                >
                                    {/* Unread dot */}
                                    <div className="mt-1.5 flex-shrink-0">
                                        {note.isRead
                                            ? <span className="w-2 h-2 rounded-full bg-slate-200 block" />
                                            : <span className="w-2 h-2 rounded-full bg-blue-500 block animate-pulse" />
                                        }
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TypeBadge type={note.type} />
                                        </div>
                                        <p className={`text-sm mb-0.5 ${note.isRead ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                                            {note.title}
                                        </p>
                                        <p className="text-sm text-slate-500 mb-2 leading-snug">{note.message}</p>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                                            <span>→ {note.userId?.name || 'Unknown'}</span>
                                            <span>·</span>
                                            <span>{new Date(note.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    {/* Read status */}
                                    <div className="flex-shrink-0 flex items-start pt-1">
                                        {note.isRead
                                            ? <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-1">
                                                <CheckCheck className="w-3 h-3" /> Read
                                            </span>
                                            : <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">
                                                New
                                            </span>
                                        }
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>

                        {notifications.length === 0 && (
                            <li className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <BellRing className="w-10 h-10 mb-3 text-slate-200" />
                                <p className="text-xs font-bold uppercase tracking-widest">No notifications yet</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminNotifications;
