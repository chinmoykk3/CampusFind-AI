import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, MapPin, Plus, Edit2, Archive, ArchiveRestore } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({ name: '', building: '', area: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchLocations = async () => {
        try {
            const res = await api.get('/locations');
            setLocations(res.data.data);
        } catch (error) {
            toast.error("Failed to load locations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.building) return toast.error("Name and Building are required.");

        setIsSubmitting(true);
        try {
            if (editingId) {
                await api.patch(`/locations/${editingId}`, formData);
                toast.success("Location updated.");
            } else {
                await api.post('/locations', formData);
                toast.success("Location created.");
            }
            setFormData({ name: '', building: '', area: '' });
            setEditingId(null);
            fetchLocations();
        } catch (error) {
            toast.error("Failed to save location.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await api.patch(`/locations/${id}`, { isActive: !currentStatus });
            toast.success(`Location ${!currentStatus ? 'activated' : 'disabled'}.`);
            fetchLocations();
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleEdit = (loc) => {
        setFormData({ name: loc.name, building: loc.building, area: loc.area || '' });
        setEditingId(loc._id);
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto text-slate-900">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-indigo-500" />
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Location Control</h1>
                        <p className="text-slate-500">Manage spatial geofences and campus buildings for the AI matching engine.</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="premium-card p-6">
                        <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Location' : 'New Location'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Name / Room</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Room 402" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Building</label>
                                <input name="building" value={formData.building} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Science Complex" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Area Details</label>
                                <input name="area" value={formData.area} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. North Wing" />
                            </div>
                            <div className="pt-2 flex gap-2">
                                <button type="submit" disabled={isSubmitting} className="flex-1 premium-button px-4 py-2 flex items-center justify-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Save</>}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', building: '', area: '' }); }} className="px-4 py-2 bg-slate-50 hover:bg-slate-700 rounded-full border border-slate-200 transition-colors text-sm font-semibold">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2 premium-card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-slate-200 uppercase text-xs tracking-widest font-bold">
                                <th className="p-4 text-slate-500">Spatial Node</th>
                                <th className="p-4 text-slate-500">Region</th>
                                <th className="p-4 text-slate-500">Status</th>
                                <th className="p-4 text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {locations.map((loc) => (
                                <tr key={loc._id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-200">{loc.name}</p>
                                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{loc.building}</p>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">{loc.area || '—'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${loc.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                            {loc.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(loc)} className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => toggleActive(loc._id, loc.isActive)} className={`p-2 rounded-lg transition-colors ${loc.isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                                                {loc.isActive ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminLocations;
