import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Check, X, ShieldAlert, Cpu } from 'lucide-react';
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

    const generateLocalReport = (match) => {
        const reportContent = `=====================================================
CAMPUSFIND AI - OFFICIAL MATCH RESOLUTION REPORT
=====================================================
DATE GENERATED: ${new Date().toLocaleString()}
MATCH ID: ${match._id}
CONFIDENCE SCORE: ${(match.scores.overall * 100).toFixed(2)}%

--- [ LOST ITEM DATA ] ---
Item: ${match.lostReportId?.itemName}
Description: ${match.lostReportId?.description || 'N/A'}
Reporter Email: ${match.lostReportId?.userId?.email || 'N/A'}

--- [ FOUND ITEM DATA ] ---
Item: ${match.foundReportId?.itemName}
Description: ${match.foundReportId?.description || 'N/A'}
Reporter Email: ${match.foundReportId?.userId?.email || 'N/A'}

--- [ TELEMETRY MATCHING SCORES ] ---
Text Similarity: ${(match.scores.text * 100).toFixed(2)}%
Category Alignment: ${(match.scores.category * 100).toFixed(2)}%
Location Proximity: ${(match.scores.location * 100).toFixed(2)}%
Temporal Relevance: ${(match.scores.time * 100).toFixed(2)}%

STATUS: CONFIRMED EXTERNALLY.
Both parties have been notified via secure email dispatch.
=====================================================`;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CampusFind_MatchReport_${match._id.slice(-6)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleReview = async (match, status) => {
        setActionLoading(match._id);
        try {
            const res = await api.patch(`/matching/${match._id}`, { status });
            toast.success(`Match successfully ${status}`);

            // Generate local file download ONLY if we confirmed it
            if (status === 'confirmed') {
                generateLocalReport(res.data.data);
                toast.success("Detailed Official Report has been saved to your device!");
            }

            fetchMatches();
        } catch (error) {
            toast.error(`Failed to ${status} match`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto pb-12 font-sans">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-6">
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <ShieldAlert className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">Review AI Matches</h1>
                    <p className="text-slate-600 font-medium mt-1">Administrative interface to evaluate automated semantic mappings.</p>
                </div>
            </motion.div>

            {matches.length === 0 ? (
                <div className="premium-card bg-slate-50 p-16 text-center rounded-2xl border border-slate-200 shadow-sm border-dashed">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No matches pending review.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {matches.map((match, idx) => (
                        <motion.div
                            key={match._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="premium-card bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-indigo-500"></div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-slate-100 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg">
                                        <Cpu className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                                        AI Confidence: <span className="text-indigo-600 font-black">{(match.scores.overall * 100).toFixed(0)}%</span>
                                    </h3>
                                </div>

                                {match.status === 'potential' || match.status === 'reviewed' ? (
                                    <div className="flex gap-3">
                                        <button
                                            disabled={actionLoading === match._id}
                                            onClick={() => handleReview(match, 'confirmed')}
                                            className="flex items-center gap-1.5 bg-white border border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {actionLoading === match._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Confirm
                                        </button>
                                        <button
                                            disabled={actionLoading === match._id}
                                            onClick={() => handleReview(match, 'rejected')}
                                            className="flex items-center gap-1.5 bg-white border border-red-500 text-red-700 hover:bg-red-50 hover:text-red-800 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {actionLoading === match._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest ${match.status === 'confirmed'
                                            ? 'bg-mint-50 text-green-700 border border-green-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                        {match.status}
                                    </span>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 relative">
                                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 hidden md:block -translate-x-1/2"></div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col">
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Lost Record
                                    </span>
                                    <p className="font-bold text-primary-900 text-lg mb-2">{match.lostReportId?.itemName || 'Unknown Item'}</p>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white p-3 border border-slate-100 rounded-lg flex-1">
                                        "{match.lostReportId?.description}"
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col">
                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Found Record
                                    </span>
                                    <p className="font-bold text-primary-900 text-lg mb-2">{match.foundReportId?.itemName || 'Unknown Item'}</p>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white p-3 border border-slate-100 rounded-lg flex-1">
                                        "{match.foundReportId?.description}"
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-3">
                                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Text Sync</p>
                                    <p className="font-black text-xl text-primary-900">{(match.scores.text * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Category</p>
                                    <p className="font-black text-xl text-primary-900">{(match.scores.category * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Location</p>
                                    <p className="font-black text-xl text-primary-900">{(match.scores.location * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time Prox</p>
                                    <p className="font-black text-xl text-primary-900">{(match.scores.time * 100).toFixed(0)}%</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl opacity-50 bg-stripes">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Image Auth</p>
                                    <p className="font-black text-xl text-slate-500">N/A</p>
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
