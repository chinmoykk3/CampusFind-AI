import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Loader2, Users, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');

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

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => <span className="font-bold text-primary-900 dark:text-stone-100">{info.getValue()}</span>,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: info => <span className="text-stone-600 dark:text-stone-400 font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('role', {
            header: 'Role',
            cell: info => {
                const role = info.getValue();
                return (
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${role === 'admin'
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                        }`}>
                        {role}
                    </span>
                );
            }
        }),
        columnHelper.accessor('isActive', {
            header: 'Status',
            cell: info => {
                const isActive = info.getValue();
                return (
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${isActive
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                );
            }
        }),
        columnHelper.accessor('createdAt', {
            header: 'Joined',
            cell: info => <span className="text-stone-500 font-medium text-sm">{new Date(info.getValue()).toLocaleDateString()}</span>,
            sortingFn: 'datetime'
        })
    ], []);

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 10,
            }
        }
    });

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto pb-12 font-sans px-4 sm:px-6 lg:px-8 pt-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30">
                        <Users className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary-900 dark:text-white tracking-tight">Manage Users</h1>
                        <p className="text-stone-600 dark:text-stone-400 font-medium mt-1">View and manage all registered accounts on CampusFind.</p>
                    </div>
                </div>

                {/* Global Search */}
                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-stone-400" />
                    </div>
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Search users..."
                        className="pl-10 block w-full border-stone-200 rounded-lg dark:bg-stone-900 dark:border-stone-800 dark:text-white sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#09090b] rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden transition-colors">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="p-4 font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <span className="w-4 flex justify-center">
                                                    {{
                                                        asc: <ChevronUp className="w-4 h-4 text-primary-600" />,
                                                        desc: <ChevronDown className="w-4 h-4 text-primary-600" />,
                                                    }[header.column.getIsSorted()] ?? null}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="p-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="p-8 text-center text-stone-500 font-medium">
                                        No users found matching "{globalFilter}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/20">
                    <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 font-medium">
                        <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
                        <span className="bg-white dark:bg-stone-800 px-2 py-1 rounded shadow-sm border border-stone-200 dark:border-stone-700 text-xs">Total: {table.getPrePaginationRowModel().rows.length}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ManageUsers;
