import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Check, X, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchMatches = async () => {
        try {
            const res = await api.get('/matching/all');
            setMatches(res.data.data);
        } catch (error) {
            toast.error("Failed to load platform matches");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleReview = async (id, status) => {
        setActionLoading(id);
        try {
            await api.put(`/matching/${id}/review`, { status });
            toast.success(`Match successfully ${status}`);
            fetchMatches();
        } catch (error) {
            toast.error(`Failed to ${status} match`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-amber-500" />
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Review System Matches</h1>
                    <p className="text-slate-600 dark:text-slate-400">Admin strictly restricted interface to evaluate automated AI mappings.</p>
                </div>
            </div>

            {matches.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border-white/20">
                    <p className="text-slate-500">No matches available in the system.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {matches.map(match => (
                        <motion.div key={match._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm ring-1 ring-slate-900/5">
                            <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                    AI Confidence: <span className="text-indigo-600">{(match.scores.overall * 100).toFixed(0)}%</span>
                                </h3>

                                {match.status === 'potential' || match.status === 'reviewed' ? (
                                    <div className="flex gap-2">
                                        <button
                                            disabled={actionLoading === match._id}
                                            onClick={() => handleReview(match._id, 'confirmed')}
                                            className="flex items-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading === match._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Confirm
                                        </button>
                                        <button
                                            disabled={actionLoading === match._id}
                                            onClick={() => handleReview(match._id, 'rejected')}
                                            className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading === match._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${match.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {match.status}
                                    </span>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-amber-500/30">
                                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 block">Lost Record</span>
                                    <p className="font-medium dark:text-white">{match.lostReportId?.itemName || 'Unknown Item'}</p>
                                    <p className="text-sm text-slate-500 mt-1">{match.lostReportId?.description}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-emerald-500/30">
                                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Found Record</span>
                                    <p className="font-medium dark:text-white">{match.foundReportId?.itemName || 'Unknown Item'}</p>
                                    <p className="text-sm text-slate-500 mt-1">{match.foundReportId?.description}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Text Match</p>
                                    <p className="font-bold dark:text-white">{(match.scores.text * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Category Match</p>
                                    <p className="font-bold dark:text-white">{(match.scores.category * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Location Match</p>
                                    <p className="font-bold dark:text-white">{(match.scores.location * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Time Match</p>
                                    <p className="font-bold dark:text-white">{(match.scores.time * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg opacity-50">
                                    <p className="text-xs text-slate-500 uppercase">Image Match</p>
                                    <p className="font-bold dark:text-white">Pending</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewMatches;
