import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await api.get('/matching');
                setMatches(res.data.data);
            } catch (error) {
                toast.error("Failed to load matches");
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">AI Matches</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">View automated potential matches for your reported items.</p>

            {matches.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border-white/20">
                    <p className="text-slate-500">No AI matches found yet for your items.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {matches.map(match => (
                        <motion.div key={match._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm ring-1 ring-slate-900/5">
                            <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                    Match Score: <span className="text-emerald-500">{(match.scores.overall * 100).toFixed(0)}%</span>
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${match.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : match.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {match.status}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 block">Lost Report</span>
                                    <p className="font-medium dark:text-white">{match.lostReportId?.itemName || 'Unknown Item'}</p>
                                    <p className="text-sm text-slate-500 mt-1">{match.lostReportId?.description}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Found Report</span>
                                    <p className="font-medium dark:text-white">{match.foundReportId?.itemName || 'Unknown Item'}</p>
                                    <p className="text-sm text-slate-500 mt-1">{match.foundReportId?.description}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <h4 className="text-sm font-semibold dark:text-slate-300 mb-2">Match Reasons:</h4>
                                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                    {match.reasons.map((reason, i) => (
                                        <li key={i}>{reason}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Matches;
