import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Tags, Plus, Edit2, Archive, ArchiveRestore } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({ name: '', slug: '', description: '', icon: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data);
        } catch (error) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.slug) return toast.error("Name and Slug are required.");

        setIsSubmitting(true);
        try {
            if (editingId) {
                await api.patch(`/categories/${editingId}`, formData);
                toast.success("Category updated.");
            } else {
                await api.post('/categories', formData);
                toast.success("Category created.");
            }
            setFormData({ name: '', slug: '', description: '', icon: '' });
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            toast.error("Failed to save category.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await api.patch(`/categories/${id}`, { isActive: !currentStatus });
            toast.success(`Category ${!currentStatus ? 'activated' : 'disabled'}.`);
            fetchCategories();
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleEdit = (cat) => {
        setFormData({ name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon || '' });
        setEditingId(cat._id);
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto text-slate-900">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Tags className="w-8 h-8 text-indigo-500" />
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Category Control</h1>
                        <p className="text-slate-500">Manage global semantic tagging classes for the AI engine.</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="premium-card p-6">
                        <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Category' : 'New Category'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Electronics" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Slug</label>
                                <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. electronics" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none focus:border-indigo-500 transition-colors" placeholder="Devices, laptops, phones..." rows={3} />
                            </div>
                            <div className="pt-2 flex gap-2">
                                <button type="submit" disabled={isSubmitting} className="flex-1 premium-button px-4 py-2 flex items-center justify-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Save</>}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', slug: '', description: '', icon: '' }); }} className="px-4 py-2 bg-slate-50 hover:bg-slate-700 rounded-full border border-slate-200 transition-colors text-sm font-semibold">
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
                                <th className="p-4 text-slate-500">Category Node</th>
                                <th className="p-4 text-slate-500">Slug</th>
                                <th className="p-4 text-slate-500">Status</th>
                                <th className="p-4 text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.map((cat) => (
                                <tr key={cat._id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-200">{cat.name}</p>
                                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{cat.description}</p>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">{cat.slug}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${cat.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                            {cat.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(cat)} className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => toggleActive(cat._id, cat.isActive)} className={`p-2 rounded-lg transition-colors ${cat.isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                                                {cat.isActive ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
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

export default AdminCategories;
