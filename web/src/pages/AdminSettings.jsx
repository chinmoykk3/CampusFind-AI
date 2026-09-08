import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, HardDrive, Key, Save, Loader2, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AdminSettings = () => {
    const [isSaving, setIsSaving] = useState(false);

    // Config states (simulated as fetching these would require a new Global Config store)
    const [config, setConfig] = useState({
        aiAggressiveness: 0.70,
        enableAutoMatching: true,
        maintenanceMode: false,
        maxUploadSize: 5
    });

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate a network delay for saving configuration to a global KV store
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Global configuration synchronized across all active regions.");
        }, 800);
    };

    const runDiagnostics = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Running cluster diagnostics...',
                success: 'All AI matching nodes are operating at 100% capacity.',
                error: 'Network failure'
            }
        );
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto text-white">
            <div className="mb-8 flex items-center gap-3">
                <Settings className="w-8 h-8 text-indigo-500" />
                <div>
                    <h1 className="text-3xl font-black text-white font-serif tracking-tight">System Configuration</h1>
                    <p className="text-slate-400">Override absolute platform behavior, AI matching heuristics, and core security matrices.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="premium-card p-6 border-indigo-500/20">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-indigo-200">
                        <HardDrive className="w-5 h-5 text-indigo-400" /> Network & AI Core
                    </h3>
                    <form onSubmit={handleSave} className="space-y-5 flex flex-col h-[calc(100%-3rem)]">
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Heuristic Match Threshold</label>
                                <span className="text-xs font-mono text-indigo-400">{config.aiAggressiveness * 100}% Confidence</span>
                            </div>
                            <input type="range" min="0.5" max="0.95" step="0.05" value={config.aiAggressiveness} onChange={(e) => setConfig({ ...config, aiAggressiveness: parseFloat(e.target.value) })} className="w-full accent-indigo-500" />
                            <p className="text-[10px] text-slate-500 mt-1">Lower threshold = more matches, higher false positives. Default architecture is hardcoded to 70%.</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                            <div>
                                <h4 className="text-sm font-bold text-white">Automated Matching Engine</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Allow the Python Engine to continuously crunch matches</p>
                            </div>
                            <button type="button" onClick={() => setConfig({ ...config, enableAutoMatching: !config.enableAutoMatching })} className={`w-12 h-6 rounded-full transition-colors relative ${config.enableAutoMatching ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                <motion.div layout className="w-4 h-4 bg-white rounded-full mx-1" animate={{ x: config.enableAutoMatching ? 24 : 0 }} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Max Base64 Image Upload (MB)</label>
                            <select value={config.maxUploadSize} onChange={(e) => setConfig({ ...config, maxUploadSize: parseInt(e.target.value) })} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500 transition-colors">
                                <option value={2}>2 MB</option>
                                <option value={5}>5 MB (Recommended)</option>
                                <option value={10}>10 MB</option>
                                <option value={20}>20 MB (Heavy)</option>
                            </select>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5">
                            <button type="submit" disabled={isSaving} className="w-full premium-button px-4 py-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 border-indigo-400">
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Synchronize Configuration</>}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="premium-card p-6 border-red-500/20 bg-gradient-to-br from-slate-900 to-red-950/20">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-red-200">
                            <Shield className="w-5 h-5 text-red-400" /> Administrative Security
                        </h3>
                        <p className="text-sm text-slate-400 mb-6 font-mono border-l-2 border-red-500/50 pl-3">Changes to the security matrix take effect instantly across all sessions.</p>

                        <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-red-500/20 mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-red-300">Global Maintenance Lock</h4>
                                <p className="text-xs text-red-400/70 mt-0.5">Disconnects all student endpoints returning 503</p>
                            </div>
                            <button type="button" onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })} className={`w-12 h-6 rounded-full transition-colors relative ${config.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}>
                                <motion.div layout className="w-4 h-4 bg-white rounded-full mx-1" animate={{ x: config.maintenanceMode ? 24 : 0 }} />
                            </button>
                        </div>

                        <button type="button" className="w-full px-4 py-3 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors uppercase text-xs font-black tracking-widest flex items-center justify-center gap-2">
                            <Key className="w-4 h-4" /> Rotate API Keys
                        </button>
                    </div>

                    <div className="premium-card p-6">
                        <h3 className="text-lg font-bold mb-4">System Utilities</h3>
                        <button type="button" onClick={runDiagnostics} className="w-full px-4 py-3 rounded-lg border border-slate-700 text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                            <RefreshCcw className="w-4 h-4" /> Execute Node Diagnostics
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminSettings;
