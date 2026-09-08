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

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-500" />
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Manage Users</h1>
                    <p className="text-slate-600 dark:text-slate-400">View and manage all registered accounts on CampusFind.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Name</th>
                                <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Email</th>
                                <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Role</th>
                                <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Status</th>
                                <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-900 dark:text-white">{user.name}</td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
