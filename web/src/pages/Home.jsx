import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, HandHeart, CheckCircle2, ChevronRight, ShieldCheck, BellRing, User, Clock, AlertCircle, ChevronDown, Activity, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroImage from '../assets/hero-image.png';
import api from '../api/axios';

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

    return (
        <div className="bg-white min-h-screen text-slate-900 font-sans">
            {/* Announcement Ticker */}
            <div className="w-full bg-zinc-900 text-white overflow-hidden whitespace-nowrap py-2.5 flex items-center shadow-sm">
                <div className="animate-marquee text-sm font-semibold tracking-wide">
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
                            <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> CampusFind Systems Active - Monitoring Campus Activity</span>
                        </div>
                    )}
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex flex-col gap-16 sm:gap-20">

                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-4">
                    {/* Hero Text */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10 w-full animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 mb-6 font-medium text-xs uppercase tracking-widest text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-200 text-white animate-pulse"></span>
                            2,400+ students reunited with their belongings
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold mb-6 tracking-tight leading-[1.05] text-primary-900 w-full">
                            Lose something? <br />
                            <span className="text-primary-600 block mt-2">Let's find it.</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 max-w-lg mb-10 leading-relaxed font-medium">
                            The intelligent, fast, and secure lost-item matching platform built specifically for your university campus.
                        </p>

                        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4">
                            <Link to="/report/lost" className="premium-button text-base w-full sm:w-auto flex justify-center px-8 py-3.5 items-center gap-2 shadow-sm focus-visible:ring-4 focus-visible:ring-primary-100">
                                Report Lost Item
                            </Link>
                            <Link to="/report/found" className="secondary-button text-base w-full sm:w-auto flex justify-center px-8 py-3.5 items-center gap-2 focus-visible:ring-4 focus-visible:ring-slate-100">
                                I Found Something
                            </Link>
                        </div>

                        <div className="flex flex-row gap-6 mt-10 pt-8 border-t border-slate-100 w-full">
                            <div className="flex flex-col">
                                <span className="text-2xl sm:text-3xl font-black text-primary-900 tracking-tight">2,400+</span>
                                <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-widest mt-1">Students Reunited</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl sm:text-3xl font-black text-primary-900 tracking-tight">50+</span>
                                <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-widest mt-1">Campuses</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl sm:text-3xl font-black text-primary-900 tracking-tight">98%</span>
                                <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 tracking-widest mt-1">Verified Handovers</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative flex justify-center lg:justify-end w-full px-4 sm:px-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-campus-map -z-10 opacity-60"></div>
                        <img
                            src={HeroImage}
                            alt="Students exchanging a lost notebook at a campus desk"
                            className="w-full max-w-md lg:max-w-lg mx-auto object-contain z-10"
                            loading="lazy"
                        />
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="w-full bg-slate-50 rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-100">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-4 tracking-tight">How it works</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Three simple steps to reunite with your lost items, securely and swiftly.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                        {/* Connecting Line Desktop */}
                        <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-px bg-slate-200 z-0"></div>

                        {[
                            { step: "1", title: "Smart Reporting", desc: "Submit details of your item. Our system accepts tags, colors, and unstructured descriptions.", icon: <User className="w-6 h-6 text-slate-700" /> },
                            { step: "2", title: "AI Semantics", desc: "Our engine uses advanced embeddings to compare physical descriptions instantly against the database.", icon: <Search className="w-6 h-6 text-slate-700" /> },
                            { step: "3", title: "Safe Handover", desc: "Both parties are notified. Visit the campus security desk for ID validation and safe handover.", icon: <HandHeart className="w-6 h-6 text-slate-700" /> }
                        ].map((step, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 relative">
                                    {step.icon}
                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                                        {step.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-primary-900 mb-2">{step.title}</h3>
                                <p className="text-[15px] text-slate-600 leading-relaxed max-w-xs">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feature Bento Grid */}
                <section>
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-3xl flex items-center justify-center gap-2 sm:text-4xl font-bold text-primary-900 tracking-tight">
                            Engineered for Campus Life
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                        {/* Dominant Card */}
                        <div className="col-span-12 lg:col-span-8 premium-card p-8 sm:p-12 flex flex-col justify-center bg-white relative">
                            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4">
                                <MapPin className="w-64 h-64 text-primary-900" />
                            </div>

                            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-6 border border-primary-100">
                                <MapPin className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="relative z-10 max-w-lg">
                                <h3 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-3 leading-tight">Campus Geospatial Zones</h3>
                                <p className="text-base text-slate-600 leading-relaxed mb-6">
                                    Items are automatically categorized into dynamic campus zones like libraries, dining halls, and specific lecture buildings. This restricts false positive semantic matches and dramatically increases absolute accuracy.
                                </p>
                                <Link to="/wall" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors gap-1 text-sm outline-none focus-visible:underline">
                                    Browse Campus Wall <ChevronRight className="w-4 h-4 translate-y-px" />
                                </Link>
                            </div>
                        </div>

                        {/* Secondary Cards */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-6">
                            <div className="premium-card p-8 flex-1 flex flex-col justify-center bg-white border-emerald-200 border-l-4 border-l-accent-mint">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-primary-900 mb-2">Verified Return</h3>
                                <p className="text-[14px] text-slate-600 leading-relaxed">
                                    Security reviews all matches. No peer-to-peer meetups required, keeping your recovery safe and secure.
                                </p>
                            </div>

                            <div className="premium-card p-8 flex-1 flex flex-col justify-center bg-white border-slate-200">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
                                    <BellRing className="w-5 h-5 text-slate-700" />
                                </div>
                                <h3 className="text-xl font-bold text-primary-900 mb-2">Instant Alerts</h3>
                                <p className="text-[14px] text-slate-600 leading-relaxed">
                                    Log an item, and the minute someone turns it in anywhere across campus, your phone pings.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Workflow Preview */}
                <section className="w-full">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-4 tracking-tight">Inside the Platform</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">A glimpse into our intelligent matching dashboard.</p>
                    </div>

                    <div className="w-full max-w-5xl mx-auto premium-card bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
                        {/* Mock App Header */}
                        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                            <div className="flex gap-6 text-sm font-semibold text-slate-500">
                                <button
                                    className={`pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'lost' ? 'border-primary-600 text-primary-900' : 'border-transparent hover:text-slate-800'}`}
                                    onClick={() => setActiveTab('lost')}
                                >
                                    My Lost Items
                                </button>
                                <button
                                    className={`pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'matches' ? 'border-primary-600 text-primary-900' : 'border-transparent hover:text-slate-500 hover:text-primary-900'}`}
                                    onClick={() => setActiveTab('matches')}
                                >
                                    Active Matches <span className="bg-primary-600 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">1</span>
                                </button>
                            </div>
                            <div className="hidden sm:flex text-sm text-slate-500 items-center gap-2">
                                <Clock className="w-4 h-4" /> Last synced: Just now
                            </div>
                        </div>

                        {/* Mock App Body */}
                        <div className="p-6">
                            {activeTab === 'lost' ? (
                                <div className="space-y-4">
                                    {/* Item Row 1 */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                                <span className="text-xl">🎒</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-primary-900">Black NorthFace Backpack</h4>
                                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" /> Main Library • Jan 24, 2026
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1">
                                                <Search className="w-3 h-3" /> Searching...
                                            </div>
                                            <Link to="/dashboard" className="text-slate-500 hover:text-slate-800"><ChevronRight className="w-5 h-5" /></Link>
                                        </div>
                                    </div>
                                    {/* Item Row 2 */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden transition-all hover:border-emerald-200">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                                <span className="text-xl">💳</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-primary-900">Student ID Card</h4>
                                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" /> Student Union • Jan 22, 2026
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1 shrink-0">
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
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <span className="text-xs text-slate-500 font-semibold block mb-1">Your Report</span>
                                                <p className="font-medium text-primary-900">"Lost my Student ID card near the dining hall."</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <span className="text-xs text-slate-500 font-semibold block mb-1">Found Item</span>
                                                <p className="font-medium text-primary-900">"Found ID card on table 4 at Student Union Dining."</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-primary-900">Item secured at Admin Desk</p>
                                                <p className="text-xs text-slate-600 mt-1">Please visit the Main Student Union Desk with a secondary form of ID to retrieve your item.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Trust and Security Section */}
                <section className="w-full bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <div className="text-center md:text-left mb-10 md:mb-14 relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-zinc-700 mb-6 font-bold text-xs uppercase tracking-widest text-zinc-100 backdrop-blur-md">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Enterprise Grade Security
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight text-white">Your data privacy is our baseline.</h2>
                        <p className="text-lg text-zinc-300 text-center max-w-2xl font-medium">We built CampusFind specifically for universities, bypassing public peer-to-peer exposure to ensure complete safety during physical handovers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-5xl mx-auto">
                        <div className="bg-white/5 border border-zinc-700 p-8 rounded-2xl backdrop-blur-md">
                            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-white">Campus Verification</h3>
                            <p className="text-sm text-zinc-300 leading-relaxed">Both the reporting student and the final receiver must authenticate using verified university credentials (.edu) and present physical student ID during the handover.</p>
                        </div>
                        <div className="bg-white/5 border border-zinc-700 p-8 rounded-2xl backdrop-blur-md">
                            <AlertCircle className="w-8 h-8 text-amber-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-white">Anonymized Reporting</h3>
                            <p className="text-sm text-zinc-300 leading-relaxed">Your personal contact details are completely stripped from the Public Wall and matching screens. Only authorized security personnel possess your records.</p>
                        </div>
                        <div className="bg-white/5 border border-zinc-700 p-8 rounded-2xl backdrop-blur-md">
                            <CheckCircle2 className="w-8 h-8 text-white mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-white">Safe Desk Handovers</h3>
                            <p className="text-sm text-zinc-300 leading-relaxed">We orchestrate the physical exchange directly at designated campus security desks, preventing the need to meet strangers across campus.</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="w-full">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900 tracking-tight mb-4">Trusted Across Campuses</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">See how students and security teams rely on the matching engine.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="premium-card bg-white p-8 border border-slate-200">
                            <div className="flex text-amber-400 mb-4">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed mb-6">"I left my laptop charger in a massive lecture hall. Posted it on CampusFind, and within 40 minutes the system alerted me that security had logged it in."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-primary-700">SR</div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary-900">Sarah Reynolds</h4>
                                    <p className="text-xs text-slate-500 font-semibold">Undergraduate Student</p>
                                </div>
                            </div>
                        </div>

                        <div className="premium-card bg-white p-8 border border-slate-200">
                            <div className="flex text-amber-400 mb-4">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed mb-6">"Before CampusFind, our lost property closet was a decentralized nightmare of excel sheets. The AI matching instantly drops our processing time by 80%."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">MT</div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary-900">Marcus Thomas</h4>
                                    <p className="text-xs text-slate-500 font-semibold">Campus Security Admin</p>
                                </div>
                            </div>
                        </div>

                        <div className="premium-card bg-white p-8 border border-slate-200">
                            <div className="flex text-amber-400 mb-4">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed mb-6">"The best part is not having to meet up with random people. It tells you exactly what desk your item is at. Extremely safe and professionally handled."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">AK</div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary-900">Alex Kim</h4>
                                    <p className="text-xs text-slate-500 font-semibold">Graduate Student</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQs Section */}
                <section className="max-w-3xl mx-auto w-full px-2 sm:px-0">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl font-bold text-primary-900 tracking-tight">Frequently Asked Questions</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="premium-card bg-white border border-slate-200 overflow-hidden text-left">
                                <button
                                    className="w-full p-5 sm:p-6 flex justify-between items-center text-left bg-white hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-inset"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    aria-expanded={openFaq === index}
                                >
                                    <h3 className="font-semibold text-primary-900 text-[15px] sm:text-base pr-4">{faq.q}</h3>
                                    <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-5 sm:px-6 pb-5 sm:pb-6 text-[14px] sm:text-[15px] font-medium text-slate-600 leading-relaxed bg-white"
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
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2 flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-white text-zinc-900 p-2 rounded-lg">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-2xl tracking-tight text-white font-display">
                                    Campus<span className="font-medium text-emerald-400">Find</span>
                                </span>
                            </div>
                            <p className="text-sm sm:text-base text-zinc-400 max-w-sm leading-relaxed mb-6 font-medium">
                                The centralized platform replacing unstructured lost-property emails with a scalable, intelligent matching system designed for higher education.
                            </p>
                        </div>

                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-slate-900 font-bold mb-6 tracking-wider uppercase text-xs">Platform</h4>
                            <ul className="flex flex-col gap-4 text-left text-sm font-medium">
                                <li><Link to="/report/lost" className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:underline">Report Lost Item</Link></li>
                                <li><Link to="/report/found" className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:underline">Submit Found Item</Link></li>
                                <li><Link to="/wall" className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:underline">Public Log</Link></li>
                                <li><Link to="/login" className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:underline">Student Login</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-slate-900 font-bold mb-6 tracking-wider uppercase text-xs">Company</h4>
                            <ul className="flex flex-col gap-4 text-left text-sm font-medium">
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:underline">About Us</Link></li>
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:underline">Security</Link></li>
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:underline">Privacy Policy</Link></li>
                                <li><a href="mailto:support@campusfind.com" className="hover:text-primary-600 transition-colors focus-visible:outline-none focus-visible:underline">Contact Support</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-200/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500 text-center md:text-left">
                        <p>© {new Date().getFullYear()} CampusFind. All rights reserved.</p>
                        <p>Built securely for universities.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
