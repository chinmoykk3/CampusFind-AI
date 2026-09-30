import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, HandHeart, CheckCircle2, ChevronRight, ShieldCheck, BellRing, User, Clock, AlertCircle, ChevronDown, Activity, Phone, Plus, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import FloatingBackground from '../components/ui/FloatingBackground';

const Home = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeTab, setActiveTab] = useState('lost');
    const [recentFeeds, setRecentFeeds] = useState([]);

    const faqs = [
        { q: "How accurate is the AI matching?", a: "Our semantic engine scores based on description, color, brand, location, and time. Over 85% of matches suggested are highly accurate and lead to successful returns." },
        { q: "Who verifies the handovers?", a: "Only designated campus administrators or security personnel can approve final handovers after verifying student ID." },
        { q: "Can I report a found item without logging in?", a: "To prevent spam and ensure accountability, all users reporting lost or found items must authenticate using their secure university email." }
    ];

    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                // Fetch the absolute latest activity globally across the platform
                const res = await api.get('/reports?limit=5');
                setRecentFeeds(res.data.data.reports || []);
            } catch (error) {
                console.error("Failed to load live feeds", error);
            }
        };
        fetchFeeds();
    }, []);

    // Create a continuous array for seamless infinite marquee scroll
    const marqueeItems = recentFeeds.length > 0
        ? [...recentFeeds, ...recentFeeds, ...recentFeeds]
        : [];

    const handwritingStyle = {
        fontFamily: "'Englebert', sans-serif",
        fontWeight: 400,
        fontSize: '105%', // Dialed back slightly for Englebert's chunkier weight
        letterSpacing: '0.01em',
        transform: 'rotate(-2deg)'
    };

    return (
        <div className="bg-white dark:bg-stone-950 min-h-screen text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300">
            {/* Announcement Ticker */}
            <div className="w-full bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-sm border-b border-stone-200/60 dark:border-stone-800/60 text-stone-600 dark:text-stone-400 overflow-hidden whitespace-nowrap py-3 flex items-center justify-start ml-2">
                <div className="animate-marquee flex flex-nowrap items-center text-sm font-medium tracking-wide">
                    {marqueeItems.length > 0 ? (
                        marqueeItems.map((feed, i) => (
                            <React.Fragment key={i}>
                                <div className="flex items-center gap-2 mx-6">
                                    {feed.type === 'lost' ? (
                                        <Search className="w-4 h-4 text-emerald-500" />
                                    ) : feed.status === 'resolved' ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    )}
                                    <span>
                                        {feed.itemName} {feed.status === 'resolved' ? 'was safely returned' : feed.type === 'lost' ? 'was reported missing' : 'was found'} at {feed.location?.name || 'Campus'}
                                    </span>
                                </div>
                                <span className="text-zinc-500 opacity-50 mx-2">•</span>
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="flex items-center gap-4 mx-4">
                            <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> CampusFind AI Systems Active - Monitoring Campus Activity</span>
                        </div>
                    )}
                </div>
            </div>

            <main className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-8 pb-16 flex flex-col gap-16 sm:gap-24">
                <FloatingBackground />

                {/* Hero Section */}
                <section className="relative w-full pt-4 sm:pt-8 lg:pt-10 pb-20">
                    {/* Custom Background Image Layer - Beautifully Framed */}
                    <div className="absolute inset-0 -z-20 pointer-events-none rounded-[36px] overflow-hidden sm:-mx-6 lg:-mx-4 xl:mx-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 dark:opacity-30"
                            style={{ backgroundImage: "url('/campus_bg.png')" }}
                        />
                        {/* Soft Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#f9fafb]/40 via-[#f9fafb]/80 to-[#f9fafb] dark:from-stone-950/50 dark:via-[#09090b]/90 dark:to-[#09090b]" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-8 items-center relative z-10 w-full mx-auto">
                        {/* Left — clean product messaging */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative z-10 w-full max-w-[650px] pl-0"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800/50"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                CampusFind AI 2.0 is live
                                <ChevronRight className="w-3.5 h-3.5" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="font-display font-black tracking-[-0.02em] flex flex-col items-start gap-1 pb-4 pt-10 sm:pt-14 relative"
                            >
                                {/* "Small things" Block */}
                                <div className="relative inline-flex items-center -rotate-[3deg] mb-2 sm:mb-4 ml-6 sm:ml-8">
                                    {/* Light Purple Pill Background */}
                                    <div className="absolute inset-0 bg-[#f3e8ff] dark:bg-purple-900/30 rounded-[30px] sm:rounded-[40px] -z-10 scale-x-[1.05] scale-y-[1.1] translate-y-1"></div>

                                    {/* Blue Marker Strokes Doodle (Top Left) */}
                                    <svg className="absolute -top-8 -left-8 w-12 h-12 text-[#3B54F4] opacity-90 -rotate-12" viewBox="0 0 50 50" fill="none">
                                        <path d="M10 35 L 20 15 M25 38 L 30 15 M40 35 L 43 18" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                                    </svg>

                                    <span className="text-[#1a1a1a] dark:text-white text-[55px] sm:text-[70px] lg:text-[85px] leading-[0.95] drop-shadow-sm px-5">Small things</span>
                                </div>

                                {/* "lose track." Block */}
                                <div className="relative inline-flex items-center ml-12 sm:ml-20 mb-4 sm:mb-8 font-['Englebert',_cursive] font-normal rotate-[1deg]">
                                    <span className="text-[#1a1a1a] dark:text-stone-200 text-[50px] sm:text-[65px] lg:text-[75px] leading-none">lose track.</span>

                                    {/* Light Blue Underline Swoosh */}
                                    <svg className="absolute -bottom-2 sm:-bottom-3 left-2 w-[105%] h-3 sm:h-5 text-[#6db3fa]" viewBox="0 0 200 20" preserveAspectRatio="none">
                                        <path d="M0 15 Q 50 5, 100 12 T 200 5" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                                    </svg>

                                    {/* Small Sparkle Doodle (Right) */}
                                    <svg className="absolute -right-20 top-4 w-10 h-10 text-[#6db3fa] opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1l14.2-14.2" /></svg>
                                </div>

                                {/* "We bring" Block */}
                                <div className="relative inline-flex items-center ml-2 sm:ml-4 -rotate-[2deg] mb-1 sm:mb-2 mt-2 sm:mt-4">
                                    {/* Purple Heart Doodle (Left) */}
                                    <svg className="absolute -left-12 bottom-1 w-8 h-8 text-[#a855f7] opacity-90 -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>

                                    <span className="text-[#1877F2] dark:text-[#3b82f6] text-[55px] sm:text-[70px] lg:text-[85px] leading-[0.95] tracking-tight drop-shadow-sm">We bring</span>

                                    {/* Yellow Burst Accents (Right) */}
                                    <svg className="absolute -right-12 -top-2 w-10 h-10 text-[#ffc107] opacity-100 rotate-12" viewBox="0 0 50 50" fill="none">
                                        <path d="M10 25 L 30 20 M15 10 L 25 2 M20 40 L 35 38" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
                                    </svg>
                                </div>

                                {/* "them back." Block */}
                                <div className="relative inline-flex items-center rotate-[1deg] ml-6 sm:ml-10 mt-1">
                                    {/* Light Pink Pill Background */}
                                    <div className="absolute inset-0 bg-[#fae8ff] dark:bg-pink-900/30 rounded-[30px] sm:rounded-[40px] -z-10 scale-x-[1.05] scale-y-[1.15] translate-y-1"></div>

                                    <span className="text-[#8b5cf6] dark:text-[#a78bfa] text-[55px] sm:text-[70px] lg:text-[85px] leading-[0.95] drop-shadow-sm px-4">them back.</span>

                                    {/* Double Purple Underline */}
                                    <svg className="absolute -bottom-4 sm:-bottom-5 left-[8%] w-[84%] h-4 sm:h-5 text-[#9333ea]" viewBox="0 0 200 30" preserveAspectRatio="none">
                                        <path d="M5 10 Q 50 16, 100 8 T 195 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                                        <path d="M25 24 Q 70 28, 120 20 T 175 26" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                                    </svg>

                                    {/* Paper Airplane Graphic & Trail */}
                                    <svg className="absolute -right-[100px] -top-[50px] w-28 h-28 text-[#7c3aed] opacity-90 hidden lg:block" viewBox="0 0 100 100" fill="none">
                                        <path d="M25 50 L 75 25 L 60 70 L 45 55 L 75 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5 85 Q 25 90, 35 70 T 45 55" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4,6" strokeLinecap="round" />
                                        <path d="M60 85 l 5 -5 M75 80 l 5 -5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </motion.h1>

                            {/* Explanation paragraph removed */}

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-wrap items-center gap-4 mt-12 mb-12"
                            >
                                <Link
                                    to="/report/lost"
                                    className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[#111111] dark:bg-white px-7 text-[15px] font-semibold text-white dark:text-[#111111] shadow-[0_8px_20px_-12px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02] hover:bg-black"
                                >
                                    <Search className="w-4 h-4" />
                                    Report Lost Item
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                                <Link
                                    to="/report/found"
                                    className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-7 text-[15px] font-semibold text-[#111111] dark:text-white transition-all hover:scale-[1.02] shadow-sm hover:border-stone-300 hover:shadow-md"
                                >
                                    <span className="text-[#9A73FF]">
                                        <HandHeart className="w-[18px] h-[18px]" />
                                    </span>
                                    Submit Found Item
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex items-center gap-8 bg-white/70 dark:bg-stone-900/70 p-4 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-white dark:border-stone-800 backdrop-blur-sm w-fit"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-[14px] bg-pink-100 flex items-center justify-center text-pink-500">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-bold text-[#111111] dark:text-white leading-tight">1.2K+</p>
                                        <p className="text-[12px] font-medium text-stone-500">Items recovered</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-stone-200 dark:bg-stone-800" />
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-[14px] bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-bold text-[#111111] dark:text-white leading-tight">8</p>
                                        <p className="text-[12px] font-medium text-stone-500">Campuses</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-stone-200 dark:bg-stone-800" />
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-[14px] bg-emerald-100 flex items-center justify-center text-emerald-500">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-bold text-[#111111] dark:text-white leading-tight">98%</p>
                                        <p className="text-[12px] font-medium text-stone-500">Match accuracy</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right — Product Composition & Collage Layout */}
                        <div className="relative w-full min-h-[720px] flex items-center justify-center scale-90 sm:scale-100">

                            {/* Floating Handwritten Notes (Adjusted spacing) */}
                            <div className="absolute top-[3%] -right-[6%] md:-right-[10%] z-20 hidden lg:block opacity-90 hover:opacity-100 transition-opacity">
                                <div className="relative rotate-[6deg]">
                                    <p className="text-[#2F47E8] text-xl font-medium tracking-wide whitespace-nowrap drop-shadow-sm" style={{ fontFamily: '"Architects Daughter", cursive, "Englebert"' }}>
                                        Lost on campus?<br />Found on CampusFind AI.
                                    </p>
                                    <svg className="absolute -bottom-7 right-[80px] w-12 h-16 text-[#2F47E8] transform scale-x-[-1] -rotate-12" viewBox="0 0 50 50" fill="none">
                                        <path d="M40 10 Q 20 15, 10 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                                        <path d="M10 40 L 15 30 M 10 40 L 22 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute bottom-[2%] -left-[14%] xl:-left-[18%] z-40 hidden lg:block opacity-90 transition-opacity hover:opacity-100">
                                <div className="relative -rotate-[4deg]">
                                    <p className="text-[#8450F9] text-xl font-medium tracking-wide drop-shadow-sm" style={{ fontFamily: '"Architects Daughter", cursive, "Englebert"' }}>
                                        Same campus.<br />Brighter days.
                                    </p>
                                    <svg className="absolute -top-3 -right-16 w-14 h-12 text-[#8450F9]" viewBox="0 0 50 20" fill="none">
                                        <path d="M0 10 Q 25 -5, 45 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                                        <path d="M45 15 L 35 10 M 45 15 L 38 23" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute -bottom-[6%] -right-[8%] z-40 hidden lg:block opacity-90 transition-opacity hover:opacity-100">
                                <div className="relative rotate-[4deg]">
                                    <p className="text-[#3B54F4] text-xl font-medium tracking-wide drop-shadow-sm" style={{ fontFamily: '"Architects Daughter", cursive, "Englebert"' }}>
                                        Different items.<br />Same stories.
                                    </p>
                                    <svg className="absolute -top-10 left-8 w-12 h-12 text-[#3B54F4] transform -scale-x-100" viewBox="0 0 40 40" fill="none">
                                        <path d="M30 35 Q 20 20, 10 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                                        <path d="M10 5 L 18 10 M 10 5 L 7 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    </svg>
                                </div>
                            </div>

                            {/* Floating Stickers with enhanced drop shadows and hover effects */}
                            {/* 1. Keys */}
                            <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute z-40 top-[15%] left-[2%] xl:-left-[4%] group">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-purple-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="text-[54px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] rotate-[15deg]">🔑<span className="absolute -bottom-2 -right-3 text-[32px] rotate-[-20deg] drop-shadow-md">😊</span></div>
                                    <div className="absolute -right-12 top-4 px-3 py-1 bg-purple-50 text-purple-700 font-bold text-[13px] rounded-lg shadow-md border border-purple-100 rotate-[8deg]">Keys</div>
                                </div>
                            </motion.div>

                            {/* 2. Earbuds */}
                            <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute z-40 top-[38%] left-[-2%] xl:-left-[8%] group">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-indigo-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-[84px] h-[84px] bg-white rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] border border-stone-100 flex items-center justify-center rotate-[-12deg]">
                                        <div className="w-[58px] h-[48px] bg-stone-50 rounded-[20px] shadow-inner relative border border-stone-200">
                                            <div className="absolute top-1/2 left-2 w-3.5 h-[22px] bg-white rounded-full shadow-sm border-stone-200 border -translate-y-1/2" />
                                            <div className="absolute top-1/2 right-2 w-3.5 h-[22px] bg-white rounded-full shadow-sm border-stone-200 border -translate-y-1/2" />
                                        </div>
                                    </div>
                                    <div className="absolute -top-5 -left-8 px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-[13px] rounded-lg shadow-md border border-indigo-100 rotate-[-5deg] z-10">Earbuds</div>
                                </div>
                            </motion.div>

                            {/* 3. Notebook */}
                            <motion.div animate={{ y: [-4, 6, -4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute z-40 bottom-[20%] left-[8%] xl:left-[2%] group">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-blue-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="text-[85px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] rotate-[-20deg]">📒</div>
                                    <div className="absolute -right-4 -bottom-2 px-3 py-1 bg-blue-50 text-blue-700 font-bold text-[13px] rounded-lg shadow-md border border-blue-100 rotate-[5deg] z-10">Notebook</div>
                                </div>
                            </motion.div>

                            {/* 4. Bottle */}
                            <motion.div animate={{ y: [4, -6, 4] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute z-40 top-[12%] right-[5%] xl:-right-[2%] group hidden sm:block">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-pink-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-[70px] h-[150px] bg-[#1a1a1a] rounded-full shadow-[0_20px_40px_-5px_rgba(0,0,0,0.25)] rotate-[15deg] flex flex-col items-center justify-start border-4 border-[#121212]">
                                        <div className="w-[36px] h-[18px] bg-[#222] rounded-t-xl -mt-5 border-2 border-[#121212] z-10" />
                                        <div className="w-full h-full bg-gradient-to-tr from-black/80 via-white/10 to-white/30 rounded-full mix-blend-overlay" />
                                    </div>
                                    <div className="absolute top-[35px] -right-16 px-3 py-1 bg-pink-50 text-pink-700 font-bold text-[13px] rounded-lg shadow-md border border-pink-200 rotate-[-5deg] z-10">Bottle</div>
                                </div>
                            </motion.div>

                            {/* 5. Wallet */}
                            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} className="absolute z-40 top-[42%] right-[-2%] xl:-right-[8%] group hidden sm:block">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-6 bg-orange-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-28 h-24 bg-gradient-to-b from-[#7c4d33] to-[#593522] rounded-[18px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.25)] rotate-[-15deg] p-1.5 border-t border-l border-[#9e6749]">
                                        <div className="w-full h-full bg-gradient-to-br from-[#4a2b1b] to-[#361e12] rounded-xl relative overflow-hidden shadow-inner border border-[#301a0e]">
                                            <div className="absolute right-0 top-1/2 w-8 h-8 bg-[#29170e] rounded-l-full -translate-y-1/2 shadow-[inset_4px_0_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 ml-1.5 shadow-sm border border-yellow-700/50" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 right-2 px-3 py-1 bg-orange-50 text-orange-700 font-bold text-[13px] rounded-lg shadow-md border border-orange-200 rotate-[8deg] z-10">Wallet</div>
                                </div>
                            </motion.div>

                            {/* 6. ID Card */}
                            <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }} className="absolute z-40 bottom-[22%] right-[2%] xl:-right-[4%] group hidden sm:flex">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-pink-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-28 h-40 bg-white rounded-[20px] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)] rotate-[10deg] p-2 border border-stone-200 overflow-hidden text-center relative flex flex-col items-center">
                                        <div className="w-full h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-[14px] absolute top-0 left-0" />
                                        <div className="w-10 h-2 bg-white/40 rounded-full z-10 mb-[22px] backdrop-blur-sm" />
                                        <div className="w-12 h-12 bg-stone-100 rounded-full z-10 mb-2 border-[3px] border-white shadow-sm flex items-center justify-center overflow-hidden">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f3f4f6" alt="avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="w-16 h-[8px] bg-stone-200 rounded-full mb-1.5 z-10" />
                                        <div className="w-12 h-[6px] bg-stone-100 rounded-full mb-3 z-10" />
                                        <div className="w-full px-2 space-y-1.5 mt-auto z-10 mb-2">
                                            <div className="w-full h-1.5 bg-stone-100 rounded-full" />
                                            <div className="w-[85%] h-1.5 bg-stone-100 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-5 -right-14 px-3 py-1 bg-pink-100 text-pink-700 font-bold text-[13px] rounded-lg shadow-md border border-pink-200 rotate-[-12deg] z-10">ID Card</div>
                                </div>
                            </motion.div>


                            {/* Phone Mockup (Centerpiece) with Hyper-Realism */}
                            <div className="relative z-30 w-[310px] h-[630px] rounded-[56px] p-[2px] bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.1)]">
                                <div className="w-full h-full rounded-[54px] p-[10px] bg-black border-[1.5px] border-zinc-700 shadow-inner">

                                    {/* Action Buttons (Hardware) */}
                                    <div className="absolute top-[120px] -left-[3px] w-[3px] h-[26px] bg-zinc-400 rounded-l-md shadow-sm" />
                                    <div className="absolute top-[170px] -left-[3px] w-[3px] h-[45px] bg-zinc-400 rounded-l-md shadow-sm" />
                                    <div className="absolute top-[230px] -left-[3px] w-[3px] h-[45px] bg-zinc-400 rounded-l-md shadow-sm" />
                                    <div className="absolute top-[200px] -right-[3px] w-[3px] h-[65px] bg-zinc-400 rounded-r-md shadow-sm" />

                                    <div className="w-full h-full rounded-[42px] bg-white overflow-hidden relative border-[4px] border-black">
                                        {/* Dynamic Island */}
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-[20px] z-50 flex items-center justify-end px-3 shadow-sm">
                                            <div className="w-3.5 h-3.5 rounded-full bg-indigo-950 border border-indigo-800/30 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50 blur-[1px]" />
                                            </div>
                                        </div>

                                        {/* Screen Content Wrapper */}
                                        <div className="w-full h-full flex flex-col pt-12 pb-5 bg-[#F9FAFB] text-stone-900 overflow-hidden relative">

                                            {/* Header */}
                                            <div className="px-5 flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-[#2F47E8] text-white p-1 rounded">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="font-bold text-[15px]">CampusFind AI</span>
                                                </div>
                                                <div className="relative">
                                                    <BellRing className="w-[18px] h-[18px] text-stone-600" />
                                                    <span className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] bg-rose-500 border-2 border-[#F9FAFB] rounded-full" />
                                                </div>
                                            </div>

                                            {/* Titles */}
                                            <div className="px-5 mb-5">
                                                <h2 className="text-[32px] font-black leading-[1] tracking-tight text-[#111111]">
                                                    Find what
                                                    <br />
                                                    <span className="text-[#2F47E8]">matters.</span>
                                                </h2>
                                            </div>

                                            {/* Search Bar */}
                                            <div className="px-5 mb-5">
                                                <div className="w-full h-11 bg-white shadow-sm border border-stone-200 rounded-[14px] flex items-center px-3.5 text-stone-400">
                                                    <Search className="w-4 h-4 mr-2" />
                                                    <span className="text-[13px] font-medium">Search for items...</span>
                                                </div>
                                            </div>

                                            {/* Categories */}
                                            <div className="px-5 mb-6 flex justify-between">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(47,71,232,0.15)] border border-[#2F47E8]/10 text-[#2F47E8]">
                                                        <span className="text-[18px]" style={{ filter: 'drop-shadow(0 2px 4px rgba(47,71,232,0.3))' }}>✨</span>
                                                    </div>
                                                    <span className="text-[11px] font-extrabold text-[#2F47E8]">All</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200">
                                                        <span className="text-[18px]">📚</span>
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-stone-500">Books</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200">
                                                        <span className="text-[18px]">💻</span>
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-stone-500">Devices</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200">
                                                        <span className="text-[18px]">💳</span>
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-stone-500">Cards</span>
                                                </div>
                                            </div>

                                            {/* Recent Activity */}
                                            <div className="px-5 flex-1 relative bg-white mx-2 rounded-t-[24px] pt-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-t border-l border-r border-stone-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-bold text-[15px] text-[#111111]">Recent activity</h3>
                                                    <span className="text-[12px] font-bold text-[#2F47E8]">See all</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-[42px] h-[42px] bg-stone-100 rounded-xl flex items-center justify-center text-[20px]">📱</div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-[13px] text-[#111111] leading-tight">iPhone 14</h4>
                                                            <p className="text-[11px] text-stone-400 font-medium">Main Library • 2h ago</p>
                                                        </div>
                                                        <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold tracking-wide rounded-md border border-emerald-100">FOUND</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-[42px] h-[42px] bg-stone-100 rounded-xl flex items-center justify-center text-[20px]">🎒</div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-[13px] text-[#111111] leading-tight">Black Backpack</h4>
                                                            <p className="text-[11px] text-stone-400 font-medium">Student Union • 5h ago</p>
                                                        </div>
                                                        <div className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-extrabold tracking-wide rounded-md border border-blue-100">MATCHED</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-[42px] h-[42px] bg-stone-100 rounded-xl flex items-center justify-center text-[20px]">🪪</div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-[13px] text-[#111111] leading-tight">Student ID Card</h4>
                                                            <p className="text-[11px] text-stone-400 font-medium">Academic Block • 1d ago</p>
                                                        </div>
                                                        <div className="px-2.5 py-1 bg-orange-50 text-orange-600 text-[10px] font-extrabold tracking-wide rounded-md border border-orange-100">PENDING</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom App Bar */}
                                            <div className="absolute bottom-0 left-0 w-full pt-4 pb-6 px-7 flex justify-between items-end bg-white border-t border-stone-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] rounded-b-[42px] z-20">
                                                <div className="flex flex-col items-center gap-1.5 opacity-100">
                                                    <div className="text-[#2F47E8]">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-[#2F47E8]">Home</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1.5 text-stone-400 hover:text-stone-600 transition-colors">
                                                    <Search className="w-6 h-6" />
                                                    <span className="text-[10px] font-bold">Search</span>
                                                </div>
                                                <div className="relative -top-6 w-[56px] h-[56px] bg-[#111111] hover:bg-black transition-colors rounded-full flex items-center justify-center text-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] border-[5px] border-white cursor-pointer z-50">
                                                    <Plus className="w-7 h-7" />
                                                </div>
                                                <div className="flex flex-col items-center gap-1.5 text-stone-400 hover:text-stone-600 transition-colors">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    <span className="text-[10px] font-bold">Matches</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1.5 text-stone-400 hover:text-stone-600 transition-colors">
                                                    <User className="w-6 h-6" />
                                                    <span className="text-[10px] font-bold">Profile</span>
                                                </div>
                                            </div>

                                            {/* iOS Home Indicator */}
                                            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-[5px] bg-zinc-800 rounded-full z-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* Horizontal Feature Grid */}
                <motion.section
                    id="how-it-works"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full flex flex-col items-center mb-10 pt-6 pb-12 border-b border-t border-stone-100 dark:border-stone-800/80 bg-white/50 dark:bg-stone-950/50 backdrop-blur-sm -mt-6 relative z-30 transition-colors"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 w-full">
                        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="flex flex-col md:flex-row items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-stone-900 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] md:text-left text-center border border-transparent hover:border-stone-200 dark:hover:border-stone-700">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-bold block text-lg">🧠</span>
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-stone-900">AI-Powered Matching</h3>
                                <p className="text-[11px] text-stone-500 mt-0.5">Finds the right match using semantic search.</p>
                            </div>
                        </motion.div>
                        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="flex flex-col md:flex-row items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-stone-900 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] md:text-left text-center border border-transparent hover:border-stone-200 dark:hover:border-stone-700">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-stone-900">Safe & Secure</h3>
                                <p className="text-[11px] text-stone-500 mt-0.5">Privacy-first and verified campus community.</p>
                            </div>
                        </motion.div>
                        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="flex flex-col md:flex-row items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-stone-900 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] md:text-left text-center border border-transparent hover:border-stone-200 dark:hover:border-stone-700">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-stone-900">Campus Community</h3>
                                <p className="text-[11px] text-stone-500 mt-0.5">Built for students, by students.</p>
                            </div>
                        </motion.div>
                        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="flex flex-col md:flex-row items-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-stone-900 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] md:text-left text-center border border-transparent hover:border-stone-200 dark:hover:border-stone-700">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-stone-900">Fast Recovery</h3>
                                <p className="text-[11px] text-stone-500 mt-0.5">Report, match, and reunite in minutes.</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Feature Bento Grid */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-3xl flex items-center justify-center gap-2 sm:text-4xl font-bold text-primary-900 dark:text-white tracking-tight">
                            Engineered for Campus Life
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mt-8">
                        {/* Dominant Clean Card */}
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="col-span-12 lg:col-span-8 bg-gradient-to-br from-stone-50 to-white dark:from-stone-900/60 dark:to-stone-950 border border-stone-200/80 dark:border-stone-800/80 rounded-[32px] p-8 sm:p-14 flex flex-col justify-center relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-500"
                        >
                            <motion.div
                                className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4"
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                transition={{ duration: 0.5 }}
                            >
                                <MapPin className="w-64 h-64 text-primary-900" />
                            </motion.div>

                            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-6 border border-stone-200 shadow-sm group-hover:scale-110 transition-transform">
                                <MapPin className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="relative z-10 max-w-xl">
                                <h3 className="text-2xl sm:text-3xl font-bold text-primary-900 dark:text-white mb-4 tracking-tight">Campus Spatial Zones</h3>
                                <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
                                    Items are automatically categorized into dynamic campus zones like libraries, dining halls, and specific lecture buildings. This restricts false positive semantic matches and dramatically increases absolute accuracy.
                                </p>
                                <Link to="/wall" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors gap-1 text-sm group-hover:translate-x-2 transition-transform">
                                    Browse Campus Wall <ChevronRight className="w-4 h-4 translate-y-px" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Secondary Clean Cards */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            <motion.div
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="bg-white dark:bg-[#09090b] rounded-[28px] p-8 flex-1 flex flex-col justify-center border border-stone-200/80 dark:border-stone-800/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] cursor-pointer group transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center mb-5 border border-stone-100 group-hover:bg-stone-100 transition-colors">
                                    <ShieldCheck className="w-5 h-5 text-stone-700" />
                                </div>
                                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">Verified Return</h3>
                                <p className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed">
                                    Security reviews all matches. No peer-to-peer meetups required, keeping your recovery secure.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="bg-white dark:bg-[#09090b] rounded-[28px] p-8 flex-1 flex flex-col justify-center border border-stone-200/80 dark:border-stone-800/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] cursor-pointer group transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center mb-5 border border-stone-100 group-hover:bg-stone-100 transition-colors">
                                    <BellRing className="w-5 h-5 text-stone-700 group-hover:animate-bounce" />
                                </div>
                                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">Instant Alerts</h3>
                                <p className="text-[14px] text-stone-600 dark:text-stone-400 leading-relaxed">
                                    Log an item, and the minute someone turns it in across campus, your phone pings.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* Product Workflow Preview */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                >
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 dark:text-white mb-4 tracking-tight">Inside the Platform</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">A glimpse into our intelligent matching dashboard.</p>
                    </div>

                    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-stone-50 dark:from-stone-900/50 to-white/10 dark:to-stone-950/10 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-200/50 dark:border-stone-800/50 backdrop-blur-md relative transition-colors">
                        <div className="w-full bg-white dark:bg-[#09090b] rounded-3xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative z-10 transition-colors">
                            {/* Mock App Header */}
                            <div className="bg-stone-50/80 dark:bg-[#09090b] border-b border-stone-200/80 dark:border-stone-800/80 px-6 pt-5 pb-0 flex flex-col sm:flex-row justify-between items-center transition-colors relative backdrop-blur-md"
                            >
                                <div className="absolute top-4 left-5 hidden sm:flex gap-1.5 opacity-80">
                                    <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20" />
                                </div>
                                <div className="w-full pl-0 sm:pl-16 flex justify-between items-end">
                                    <div className="flex gap-6 text-sm font-semibold text-stone-500 dark:text-stone-400">
                                        <button
                                            className={`pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'lost' ? 'border-primary-600 text-primary-900' : 'border-transparent hover:text-stone-800'}`}
                                            onClick={() => setActiveTab('lost')}
                                        >
                                            My Lost Items
                                        </button>
                                        <button
                                            className={`pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'matches' ? 'border-primary-600 text-primary-900 dark:text-white' : 'border-transparent hover:text-stone-500 hover:text-primary-900 dark:hover:text-white'}`}
                                            onClick={() => setActiveTab('matches')}
                                        >
                                            Active Matches <span className="bg-primary-600 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">1</span>
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex text-[13px] text-stone-400 font-medium items-center gap-2 mb-4">
                                        <Clock className="w-4 h-4" /> Last synced: Just now
                                    </div>
                                </div>
                            </div>

                            {/* Mock App Body */}
                            <div className="p-6">
                                {activeTab === 'lost' ? (
                                    <div className="space-y-4">
                                        {/* Item Row 1 */}
                                        <div className="bg-white dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors shadow-sm hover:shadow-md">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-700/50">
                                                    <span className="text-xl">🎒</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-primary-900 dark:text-white">Black NorthFace Backpack</h4>
                                                    <p className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" /> Main Library • Jan 24, 2026
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 text-xs font-bold flex items-center gap-1">
                                                    <Search className="w-3 h-3" /> Searching...
                                                </div>
                                                <Link to="/dashboard" className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"><ChevronRight className="w-5 h-5" /></Link>
                                            </div>
                                        </div>
                                        {/* Item Row 2 */}
                                        <div className="bg-white dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.15)]">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-700/50">
                                                    <span className="text-xl">💳</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-primary-900 dark:text-white">Student ID Card</h4>
                                                    <p className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" /> Student Union • Jan 22, 2026
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20 text-xs font-bold flex items-center gap-1 shrink-0">
                                                    <CheckCircle2 className="w-3 h-3" /> Match Found: 96%
                                                </div>
                                                <Link to="/matches" className="secondary-button text-xs px-3 py-1.5 whitespace-nowrap">View Match</Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white p-6 rounded-xl border border-primary-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                                        <div className="flex-1 w-full space-y-4">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-lg text-primary-900 border-b-2 border-emerald-200 pb-1 inline-block">High Confidence Match</h4>
                                                <span className="px-2 py-1 rounded bg-primary-50 text-primary-700 text-xs font-bold border border-primary-100">AI Confidence: 96%</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                                <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                                                    <span className="text-xs text-stone-500 font-semibold block mb-1">Your Report</span>
                                                    <p className="font-medium text-primary-900">"Lost my Student ID card near the dining hall."</p>
                                                </div>
                                                <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                                                    <span className="text-xs text-stone-500 font-semibold block mb-1">Found Item</span>
                                                    <p className="font-medium text-primary-900">"Found ID card on table 4 at Student Union Dining."</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-primary-900">Item secured at Admin Desk</p>
                                                    <p className="text-xs text-stone-600 mt-1">Please visit the Main Student Union Desk with a secondary form of ID to retrieve your item.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Trust and Security Section */}
                <motion.section
                    id="about"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="w-full scroll-mt-24 bg-gradient-to-b from-stone-50 to-stone-100/50 dark:from-stone-900/40 dark:to-stone-950/40 border border-stone-200 dark:border-stone-800/60 rounded-[40px] p-8 sm:p-12 lg:p-20 relative transition-colors overflow-hidden"
                >
                    <div className="text-center md:text-left mb-10 md:mb-14 relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 mb-6 font-semibold text-xs uppercase tracking-widest text-stone-600 dark:text-stone-400 shadow-sm transition-colors">
                            <ShieldCheck className="w-4 h-4 text-primary-600" />
                            Enterprise Security
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-primary-900 dark:text-white">Your data privacy is our baseline.</h2>
                        <p className="text-lg text-stone-600 max-w-2xl mx-auto font-medium mb-10">We built CampusFind AI specifically for universities, bypassing public peer-to-peer exposure to ensure complete safety during physical handovers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-5xl mx-auto">
                        <motion.div whileHover={{ y: -5, shadow: "0px 10px 30px -10px rgba(0,0,0,0.1)" }} transition={{ duration: 0.2 }} className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800/50 p-10 rounded-[28px] shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] hover:border-primary-100 dark:hover:border-primary-900/50 transition-all duration-300 group">
                            <ShieldCheck className="w-6 h-6 text-primary-600 mb-4" />
                            <h3 className="text-lg font-bold mb-2 text-primary-900">Campus Verification</h3>
                            <p className="text-sm text-stone-600 leading-relaxed">Both the reporting student and the final receiver must authenticate using verified university credentials and present physical student ID.</p>
                        </motion.div>
                        <motion.div whileHover={{ y: -5, shadow: "0px 10px 30px -10px rgba(0,0,0,0.1)" }} transition={{ duration: 0.2 }} className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800/50 p-10 rounded-[28px] shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] hover:border-primary-100 dark:hover:border-primary-900/50 transition-all duration-300 group">
                            <AlertCircle className="w-6 h-6 text-primary-600 mb-4" />
                            <h3 className="text-lg font-bold mb-2 text-primary-900">Anonymized Reporting</h3>
                            <p className="text-sm text-stone-600 leading-relaxed">Your personal contact details are completely stripped from the Public Wall and matching screens to protect student privacy.</p>
                        </motion.div>
                        <motion.div whileHover={{ y: -5, shadow: "0px 10px 30px -10px rgba(0,0,0,0.1)" }} transition={{ duration: 0.2 }} className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800/50 p-10 rounded-[28px] shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] hover:border-primary-100 dark:hover:border-primary-900/50 transition-all duration-300 group">
                            <CheckCircle2 className="w-6 h-6 text-primary-600 mb-4" />
                            <h3 className="text-lg font-bold mb-2 text-primary-900">Safe Desk Handovers</h3>
                            <p className="text-sm text-stone-600 leading-relaxed">We orchestrate the physical exchange directly at designated campus security desks, preventing the need to meet strangers.</p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Testimonials */}
                <motion.section
                    id="campuses"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="w-full scroll-mt-24"
                >
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900 tracking-tight mb-4">Trusted Across Campuses</h2>
                        <p className="text-lg text-stone-600 max-w-2xl mx-auto font-medium">See how students and security teams rely on the matching engine.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div whileHover={{ y: -6, scale: 1.02 }} className="premium-card bg-white dark:bg-stone-950 p-10 border border-stone-200 dark:border-stone-800 group cursor-pointer shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[32px] hover:-translate-y-2 min-h-[250px]">
                            <div className="flex text-stone-200 dark:text-stone-800 mb-4 font-bold tracking-[0.1em] text-lg">
                                ★★★★★
                            </div>
                            <p className="text-stone-700 font-medium leading-relaxed mb-6 group-hover:text-stone-900"></p>
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="w-10 h-10 bg-stone-50 dark:bg-stone-900 rounded-full flex items-center justify-center font-bold text-transparent"></div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary-900"></h4>
                                    <p className="text-xs text-stone-500 font-semibold"></p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -6, scale: 1.02 }} className="premium-card bg-white dark:bg-stone-950 p-10 border border-stone-200 dark:border-stone-800 group cursor-pointer shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[32px] hover:-translate-y-2 min-h-[250px]">
                            <div className="flex text-stone-200 dark:text-stone-800 mb-4 font-bold tracking-[0.1em] text-lg">
                                ★★★★★
                            </div>
                            <p className="text-stone-700 font-medium leading-relaxed mb-6 group-hover:text-stone-900"></p>
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="w-10 h-10 bg-stone-50 dark:bg-stone-900 rounded-full flex items-center justify-center font-bold text-transparent"></div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary-900"></h4>
                                    <p className="text-xs text-stone-500 font-semibold"></p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -6, scale: 1.02 }} className="premium-card bg-white dark:bg-stone-950 p-10 border border-stone-200 dark:border-stone-800 group cursor-pointer shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[32px] hover:-translate-y-2 min-h-[250px]">
                            <div className="flex text-stone-200 dark:text-stone-800 mb-4 font-bold tracking-[0.1em] text-lg">
                                ★★★★★
                            </div>
                            <p className="text-stone-700 font-medium leading-relaxed mb-6 group-hover:text-stone-900"></p>
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="w-10 h-10 bg-stone-50 dark:bg-stone-900 rounded-full flex items-center justify-center font-bold text-transparent"></div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary-900"></h4>
                                    <p className="text-xs text-stone-500 font-semibold"></p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* FAQs Section */}
                <section className="max-w-3xl mx-auto w-full px-2 sm:px-0">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl font-bold text-primary-900 tracking-tight">Frequently Asked Questions</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="premium-card bg-white border border-stone-200 overflow-hidden text-left">
                                <button
                                    className="w-full p-5 sm:p-6 flex justify-between items-center text-left bg-white hover:bg-stone-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-inset"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    aria-expanded={openFaq === index}
                                >
                                    <h3 className="font-semibold text-primary-900 text-[15px] sm:text-base pr-4">{faq.q}</h3>
                                    <ChevronDown className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-5 sm:px-6 pb-5 sm:pb-6 text-[14px] sm:text-[15px] font-medium text-stone-600 leading-relaxed bg-white"
                                        >
                                            <div className="pt-2">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Advanced Footer */}
            <footer className="w-full bg-zinc-900 border-t border-zinc-900 pt-16 sm:pt-20 pb-8 sm:pb-10 z-10 text-zinc-400">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-10 xl:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2 flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-white text-zinc-900 p-2 rounded-lg">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-2xl tracking-tight text-white font-display">
                                    Campus<span className="font-medium text-emerald-400">Find AI</span>
                                </span>
                            </div>
                            <p className="text-sm sm:text-base text-zinc-400 max-w-sm leading-relaxed mb-6 font-medium">
                                The centralized platform replacing unstructured lost-property emails with a scalable, intelligent matching system designed for higher education.
                            </p>
                        </div>

                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-white font-semibold mb-5 tracking-wide text-sm">Product</h4>
                            <ul className="flex flex-col gap-4 text-left text-[14px] font-normal text-zinc-400">
                                <li><Link to="/report/lost" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Report Lost Item</Link></li>
                                <li><Link to="/report/found" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Submit Found Item</Link></li>
                                <li><Link to="/wall" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Public Log</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Student Login</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-white font-semibold mb-5 tracking-wide text-sm">Company</h4>
                            <ul className="flex flex-col gap-4 text-left text-[14px] font-normal text-zinc-400">
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">About Us</Link></li>
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Security Protocols</Link></li>
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Privacy Policy</Link></li>
                                <li><a href="mailto:support@campusfind.com" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Contact Support</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-stone-200/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-stone-500 text-center md:text-left">
                        <p>© {new Date().getFullYear()} CampusFind AI. All rights reserved.</p>
                        <p>Built securely for universities.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
