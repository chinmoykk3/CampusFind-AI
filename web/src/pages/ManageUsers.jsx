import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data.data.users);
            } catch (error) {
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto pb-12 font-sans">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-6">
                <div className="p-3 bg-primary-50 rounded-xl border border-primary-100">
                    <Users className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">Manage Users</h1>
                    <p className="text-slate-600 font-medium mt-1">View and manage all registered accounts on CampusFind.</p>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="premium-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Name</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Email</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Role</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Status</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user, idx) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="p-4 font-bold text-primary-900">{user.name}</td>
                                    <td className="p-4 text-slate-600 font-medium">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${user.isActive
                                                ? 'bg-mint-50 text-green-700 border border-green-200'
                                                : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 font-medium text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default ManageUsers;
