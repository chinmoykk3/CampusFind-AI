import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, BellRing, Send, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
    const [recentNotifications, setRecentNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const [formData, setFormData] = useState({ title: '', message: '' });

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/admin');
            setRecentNotifications(res.data.data);
        } catch (error) {
            toast.error("Failed to load platform network logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) return toast.error("Title and Message required");

        setIsBroadcasting(true);
        try {
            const result = await api.post('/notifications/broadcast', formData);
            toast.success(result.data.message || "Priority broadcast sent successfully.");
            setFormData({ title: '', message: '' });
            fetchNotifications();
        } catch (error) {
            toast.error("Failed to execute broadcast protocol.");
        } finally {
            setIsBroadcasting(false);
        }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    const NotificationBadge = ({ type }) => {
        switch (type) {
            case 'potential_match': return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase text-[10px] font-bold tracking-widest rounded">AI Match</span>;
            case 'system': return <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase text-[10px] font-bold tracking-widest rounded">System</span>;
            default: return <span className="px-2 py-1 bg-slate-500/20 text-slate-500 border border-slate-500/30 uppercase text-[10px] font-bold tracking-widest rounded">{type.replace('_', ' ')}</span>;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto text-slate-900">
            <div className="mb-8 flex items-center gap-3">
                <BellRing className="w-8 h-8 text-indigo-500" />
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Notification Control</h1>
                    <p className="text-slate-500">Launch global announcements and oversee real-time AI alerting systems.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="premium-card p-6 border-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl" />
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-indigo-100">
                            <Volume2 className="w-5 h-5 text-indigo-400" /> Global Broadcast
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">Force push a high-priority 'System' alert to all active student clients simultaneously.</p>

                        <form onSubmit={handleBroadcast} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Headline</label>
                                <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-white border border-indigo-500/30 rounded-lg p-2.5 text-slate-900 outline-none focus:border-indigo-400 transition-colors" placeholder="e.g. Server Maintenance" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Payload Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} className="w-full bg-white border border-indigo-500/30 rounded-lg p-2.5 text-slate-900 outline-none focus:border-indigo-400 transition-colors" placeholder="Type announcement details here..." rows={4} />
                            </div>
                            <button type="submit" disabled={isBroadcasting} className="w-full premium-button px-4 py-3 flex items-center justify-center gap-2 mt-4 bg-indigo-600 hover:bg-indigo-500 !border-indigo-400">
                                {isBroadcasting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Execute Broadcast Protocol</>}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2 premium-card overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-white hidden md:block">
                        <p className="font-semibold text-sm uppercase tracking-widest text-slate-500">Live Network Telemetry (Top 100)</p>
                    </div>
                    <ul className="divide-y divide-white/5 h-[600px] overflow-y-auto custom-scrollbar">
                        {recentNotifications.map((note) => (
                            <li key={note._id} className="p-4 hover:bg-white/[0.02] transition-colors flex gap-4">
                                <div className="mt-1"><NotificationBadge type={note.type} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 mb-0.5">{note.title}</p>
                                    <p className="text-sm text-slate-500 mb-2">{note.message}</p>
                                    <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                                        <span>Target: {note.userId?.name || 'Unknown'}</span>
                                        <span>•</span>
                                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-xs">
                                    {note.isRead ? <span className="text-slate-600 uppercase font-black">Read</span> : <span className="text-indigo-400 uppercase font-black">Delivered</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminNotifications;
