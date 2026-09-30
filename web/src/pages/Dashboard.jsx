import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import api from '../api/axios';
import {
    Search,
    ShieldCheck,
    Sparkles,
    ArrowRight,
    Activity,
    MapPin,
    HandHeart,
    Bell,
    BellOff,
    FileText,
    Plus,
    ChevronRight,
    BarChart3,
    Clock3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({ lost: 0, found: 0, matches: 0, myReports: 0 });
    const [recentReports, setRecentReports] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [pubRes, matchRes, myRes, notifRes] = await Promise.allSettled([
                    api.get('/reports/public'),
                    api.get('/matching'),
                    api.get('/reports?limit=6'),
                    api.get('/notifications'),
                ]);

                if (pubRes.status === 'fulfilled') {
                    const all = pubRes.value.data.data || [];
                    setStats(prev => ({
                        ...prev,
                        lost: all.filter(r => r.type === 'lost').length,
                        found: all.filter(r => r.type === 'found').length,
                    }));
                    setRecentReports(all.slice(0, 6));
                }

                if (matchRes.status === 'fulfilled') {
                    setStats(prev => ({
                        ...prev,
                        matches: matchRes.value.data.data?.length || 0,
                    }));
                }

                if (myRes.status === 'fulfilled') {
                    setStats(prev => ({
                        ...prev,
                        myReports: myRes.value.data.data?.pagination?.total || 0,
                    }));
                }

                if (notifRes.status === 'fulfilled') {
                    const { notifications: n, unreadCount: u } = notifRes.value.data.data || {};
                    setNotifications((n || []).slice(0, 4));
                    setUnreadCount(u || 0);
                }
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const itemV = {
        hidden: { opacity: 0, y: 12 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 260, damping: 24 },
        },
    };

    const firstName = user?.name?.split(' ')[0] || 'Student';

    if (loading) {
        return (
            <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full rounded-[28px]" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-28 rounded-2xl" />
                        ))}
                    </div>
                    <div className="grid lg:grid-cols-12 gap-5">
                        <Skeleton className="lg:col-span-8 h-80 rounded-2xl" />
                        <Skeleton className="lg:col-span-4 h-80 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Active Lost Items',
            value: stats.lost,
            icon: Search,
            iconBox: 'bg-orange-50 text-orange-500 border-orange-100',
            href: '/explore',
        },
        {
            label: 'Items Found',
            value: stats.found,
            icon: ShieldCheck,
            iconBox: 'bg-emerald-50 text-emerald-500 border-emerald-100',
            href: '/explore',
        },
        {
            label: 'AI Matches',
            value: stats.matches,
            icon: Sparkles,
            iconBox: 'bg-blue-50 text-blue-600 border-blue-100',
            href: '/matches',
        },
        {
            label: 'My Reports',
            value: stats.myReports,
            icon: FileText,
            iconBox: 'bg-violet-50 text-violet-600 border-violet-100',
            href: '/reports',
        },
    ];

    const quickActions = [
        {
            title: 'Report Lost Item',
            description: 'File a new report',
            href: '/report/lost',
            icon: Plus,
            iconBox: 'bg-orange-50 text-orange-500 border-orange-100',
            hover: 'hover:border-orange-200 hover:bg-orange-50/40',
        },
        {
            title: 'Register Found Item',
            description: 'Help return to owner',
            href: '/report/found',
            icon: HandHeart,
            iconBox: 'bg-emerald-50 text-emerald-500 border-emerald-100',
            hover: 'hover:border-emerald-200 hover:bg-emerald-50/40',
        },
        {
            title: 'Explore Matches',
            description: 'View AI suggestions',
            href: '/matches',
            icon: Sparkles,
            iconBox: 'bg-blue-50 text-blue-600 border-blue-100',
            hover: 'hover:border-blue-200 hover:bg-blue-50/40',
        },
        {
            title: 'My Reports',
            description: 'Track your submissions',
            href: '/reports',
            icon: FileText,
            iconBox: 'bg-violet-50 text-violet-600 border-violet-100',
            hover: 'hover:border-violet-200 hover:bg-violet-50/40',
        },
    ];

    return (
        <div className="min-h-full bg-[#f8f9fc]">
            <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-5">
                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.06 } },
                    }}
                    initial="hidden"
                    animate="show"
                    className="space-y-5"
                >
                    {/* Hero */}
                    <motion.section
                        variants={itemV}
                        className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(30,41,59,0.06)]"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.10),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.10),transparent_32%)]" />
                        <div className="relative grid lg:grid-cols-[0.9fr_1.1fr] min-h-[250px]">
                            <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-50 border border-violet-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                    Campus activity hub
                                </div>

                                <p className="mt-5 text-sm font-semibold text-slate-500">
                                    Good to see you again,
                                </p>
                                <h1 className="mt-1 text-3xl sm:text-4xl lg:text-[42px] leading-[1.05] font-black tracking-[-0.04em] text-slate-950">
                                    Welcome back,
                                    <span className="block text-violet-600">{firstName}!</span>
                                </h1>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                                    Manage reports, review AI matches, and keep track of what is happening around campus.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        to="/report/lost"
                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-violet-600"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Report an item
                                    </Link>
                                    <Link
                                        to="/matches"
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
                                    >
                                        Review matches
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative min-h-[230px] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent z-10 lg:w-1/3" />
                                <img
                                    src="/campus-dashboard.jpg"
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-indigo-100 to-slate-100" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(124,58,237,0.18),transparent_35%)]" />
                                <div className="absolute right-6 top-6 z-20 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-extrabold text-slate-900">A safer campus</p>
                                            <p className="mt-0.5 text-[10px] font-medium text-slate-500">Starts with everyone.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-7 left-8 z-20 max-w-[260px]">
                                    <p className="text-2xl font-black tracking-tight text-slate-900">
                                        Lost today.
                                        <span className="block text-violet-600">Found tomorrow.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Stats */}
                    <motion.div variants={itemV} className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {statCards.map(({ label, value, icon: Icon, iconBox, href }) => (
                            <Link
                                key={label}
                                to={href}
                                className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-[0_5px_20px_rgba(30,41,59,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${iconBox}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                                </div>
                                <p className="mt-4 text-2xl font-black tracking-tight text-slate-950">{value}</p>
                                <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                                    {label}
                                </p>
                            </Link>
                        ))}
                    </motion.div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        <motion.div variants={itemV} className="lg:col-span-8 space-y-5">
                            {/* Quick actions */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_5px_20px_rgba(30,41,59,0.04)]">
                                <div className="flex items-start justify-between gap-4 mb-5">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                                <Sparkles className="h-4 w-4" />
                                            </div>
                                            <h2 className="text-base font-black text-slate-950">Quick Actions</h2>
                                        </div>
                                        <p className="mt-1 pl-10 text-xs text-slate-500">What would you like to do today?</p>
                                    </div>
                                    <span className="hidden sm:block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                        Get started
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                                    {quickActions.map(({ title, description, href, icon: Icon, iconBox, hover }) => (
                                        <Link
                                            key={title}
                                            to={href}
                                            className={`group relative min-h-[132px] rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${hover}`}
                                        >
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconBox}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <p className="mt-4 text-xs font-extrabold text-slate-900">{title}</p>
                                            <p className="mt-1 text-[10px] leading-4 text-slate-500">{description}</p>
                                            <span className="absolute right-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 shadow-sm transition group-hover:text-violet-600">
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Recent activity */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_5px_20px_rgba(30,41,59,0.04)]">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <Activity className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-black text-slate-950">Recent Campus Activity</h2>
                                            <p className="text-[10px] text-slate-400">Latest reports from campus</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/wall"
                                        className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-violet-600 hover:text-violet-700"
                                    >
                                        View all <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>

                                {recentReports.length === 0 ? (
                                    <EmptyState
                                        icon={BarChart3}
                                        title="No activity on campus yet."
                                        description="Once a report is filed or something is found, the latest activity will appear here."
                                    />
                                ) : (
                                    <ul className="divide-y divide-slate-100">
                                        {recentReports.map(report => {
                                            const img = report.images?.[0];

                                            return (
                                                <li
                                                    key={report._id}
                                                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                                >
                                                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                        {img ? (
                                                            <img
                                                                src={`${BACKEND}${img.url}`}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                                onError={e => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className={`h-full w-full flex items-center justify-center ${report.type === 'lost' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                                {report.type === 'lost'
                                                                    ? <Search className="h-5 w-5" />
                                                                    : <ShieldCheck className="h-5 w-5" />}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-extrabold text-slate-900">
                                                            {report.itemName}
                                                        </p>
                                                        <p className="mt-1 flex items-center gap-1 truncate text-[10px] font-medium text-slate-400">
                                                            <MapPin className="h-3 w-3 shrink-0" />
                                                            {report.locationId?.name || 'Unknown location'}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${report.type === 'lost'
                                                            ? 'border-orange-100 bg-orange-50 text-orange-600'
                                                            : 'border-emerald-100 bg-emerald-50 text-emerald-600'
                                                            }`}
                                                    >
                                                        {report.type}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </section>
                        </motion.div>

                        <motion.div variants={itemV} className="lg:col-span-4 space-y-5">
                            {/* AI overview */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_5px_20px_rgba(30,41,59,0.04)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-black text-slate-950">AI Match Overview</h2>
                                            <p className="text-[10px] text-slate-400">Your matching activity</p>
                                        </div>
                                    </div>
                                    <Link to="/matches" className="text-[10px] font-extrabold text-violet-600 hover:text-violet-700">
                                        View all
                                    </Link>
                                </div>

                                <div className="mt-6 flex items-center gap-5">
                                    <div
                                        className="relative h-32 w-32 shrink-0 rounded-full p-[11px]"
                                        style={{
                                            background: 'conic-gradient(#7c3aed 0deg 360deg, #ede9fe 360deg)',
                                        }}
                                    >
                                        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-inner">
                                            <span className="text-2xl font-black tracking-tight text-slate-950">{stats.matches}</span>
                                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Matches</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="flex items-center gap-2 text-slate-600">
                                                <span className="h-2 w-2 rounded-full bg-violet-500" />
                                                Pending Review
                                            </span>
                                            <b className="text-slate-900">{stats.matches}</b>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="flex items-center gap-2 text-slate-600">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                Confirmed
                                            </span>
                                            <b className="text-slate-900">0</b>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="flex items-center gap-2 text-slate-600">
                                                <span className="h-2 w-2 rounded-full bg-rose-500" />
                                                Rejected
                                            </span>
                                            <b className="text-slate-900">0</b>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50/70 p-3.5">
                                    <div className="flex gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-extrabold text-slate-800">AI matching is active</p>
                                            <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                                Review suggested matches regularly to help reconnect items faster.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Notifications */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(30,41,59,0.04)]">
                                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                            <Bell className="h-4 w-4" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[8px] font-black text-white">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-base font-black text-slate-950">Notifications</h2>
                                    </div>
                                    <Link
                                        to="/notifications"
                                        className="text-[10px] font-extrabold text-violet-600 hover:text-violet-700"
                                    >
                                        View all
                                    </Link>
                                </div>

                                {notifications.length === 0 ? (
                                    <EmptyState
                                        icon={BellOff}
                                        title="All clear"
                                        description="You have no new notifications right now."
                                    />
                                ) : (
                                    <ul className="divide-y divide-slate-100">
                                        {notifications.map(n => (
                                            <li
                                                key={n._id}
                                                className={`px-5 py-3.5 transition hover:bg-slate-50 ${!n.isRead ? 'bg-violet-50/30' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.isRead ? 'bg-violet-500' : 'bg-slate-200'}`} />
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`text-[11px] leading-4 ${!n.isRead ? 'font-extrabold text-slate-800' : 'font-semibold text-slate-600'}`}>
                                                            {n.title}
                                                        </p>
                                                        <p className="mt-0.5 truncate text-[10px] leading-4 text-slate-400">
                                                            {n.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>

                            {/* Small help card */}
                            <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-violet-600">
                                            CampusFind tip
                                        </p>
                                        <p className="mt-2 text-sm font-black leading-5 text-slate-900">
                                            Add clear details and locations to improve matching.
                                        </p>
                                    </div>
                                    <Clock3 className="h-5 w-5 shrink-0 text-violet-400" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
