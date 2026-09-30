const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const newHero = `                {/* Hero Section */}
                <section className="relative w-full pt-10 sm:pt-14 lg:pt-20 pb-20">
                    {/* Abstract Ethereal Background Blobs */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] rounded-full bg-indigo-50/60 dark:bg-indigo-900/20 blur-3xl opacity-80" />
                        <div className="absolute top-[20%] -right-[5%] w-[40%] h-[50%] rounded-full bg-pink-50/60 dark:bg-pink-900/20 blur-3xl opacity-80" />
                        <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[40%] rounded-full bg-purple-50/60 dark:bg-purple-900/20 blur-3xl opacity-80" />
                        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[45%] rounded-full bg-blue-50/60 dark:bg-blue-900/20 blur-3xl opacity-80" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-8 items-center relative z-10 w-full max-w-[1300px] mx-auto">
                        {/* Left — clean product messaging */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 w-full max-w-[580px] lg:pl-4 xl:pl-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800/50"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                CampusFind 2.0 is live
                                <ChevronRight className="w-3.5 h-3.5" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="font-display font-black tracking-[-0.04em] leading-[1.05] text-[#1a1a1a] dark:text-white text-[56px] sm:text-[68px] lg:text-[76px] xl:text-[84px] mb-6 relative"
                            >
                                <span className="block">Small things</span>
                                <span className="block">lose track.</span>
                                <span className="block text-[#3B54F4] dark:text-[#5C73F2] relative w-fit mt-1">
                                    We bring
                                    <span className="block z-10 relative">them back.</span>
                                    {/* Squiggle underline (adjusted) */}
                                    <svg className="absolute w-full -bottom-1 left-0 h-4 sm:h-6 text-[#9A73FF] -z-10 opacity-90" viewBox="0 0 200 20" preserveAspectRatio="none">
                                        <path d="M0 10 Q 25 18, 50 10 T 100 10 T 150 10 T 200 10" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[17px] sm:text-[18px] leading-[1.6] text-stone-500 dark:text-stone-300 mb-8 max-w-[480px]"
                            >
                                Report a lost item, submit something you've found, and let CampusFind connect the two. Built for everyday campus life.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-wrap items-center gap-4 mb-12"
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
                                    <p className="text-[#2F47E8] text-xl font-medium tracking-wide whitespace-nowrap drop-shadow-sm" style={{ fontFamily:'"Architects Daughter", cursive, "Englebert"' }}>
                                        Lost on campus?<br/>Found on CampusFind.
                                    </p>
                                    <svg className="absolute -bottom-7 right-[80px] w-12 h-16 text-[#2F47E8] transform scale-x-[-1] -rotate-12" viewBox="0 0 50 50" fill="none">
                                        <path d="M40 10 Q 20 15, 10 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                        <path d="M10 40 L 15 30 M 10 40 L 22 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="absolute bottom-[2%] -left-[14%] xl:-left-[18%] z-40 hidden lg:block opacity-90 transition-opacity hover:opacity-100">
                                <div className="relative -rotate-[4deg]">
                                    <p className="text-[#8450F9] text-xl font-medium tracking-wide drop-shadow-sm" style={{ fontFamily:'"Architects Daughter", cursive, "Englebert"' }}>
                                        Same campus.<br/>Brighter days.
                                    </p>
                                    <svg className="absolute -top-3 -right-16 w-14 h-12 text-[#8450F9]" viewBox="0 0 50 20" fill="none">
                                        <path d="M0 10 Q 25 -5, 45 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                        <path d="M45 15 L 35 10 M 45 15 L 38 23" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute -bottom-[6%] -right-[8%] z-40 hidden lg:block opacity-90 transition-opacity hover:opacity-100">
                                <div className="relative rotate-[4deg]">
                                    <p className="text-[#3B54F4] text-xl font-medium tracking-wide drop-shadow-sm" style={{ fontFamily:'"Architects Daughter", cursive, "Englebert"' }}>
                                        Different items.<br/>Same stories.
                                    </p>
                                    <svg className="absolute -top-10 left-8 w-12 h-12 text-[#3B54F4] transform -scale-x-100" viewBox="0 0 40 40" fill="none">
                                        <path d="M30 35 Q 20 20, 10 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                        <path d="M10 5 L 18 10 M 10 5 L 7 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Floating Stickers with enhanced drop shadows and hover effects */}
                            {/* 1. Keys */}
                            <motion.div animate={{ y:[-6, 6, -6] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }} className="absolute z-40 top-[15%] left-[2%] xl:-left-[4%] group">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-purple-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    <div className="text-[54px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] rotate-[15deg]">🔑<span className="absolute -bottom-2 -right-3 text-[32px] rotate-[-20deg] drop-shadow-md">😊</span></div>
                                    <div className="absolute -right-12 top-4 px-3 py-1 bg-purple-50 text-purple-700 font-bold text-[13px] rounded-lg shadow-md border border-purple-100 rotate-[8deg]">Keys</div>
                                </div>
                            </motion.div>

                            {/* 2. Earbuds */}
                            <motion.div animate={{ y:[5, -5, 5] }} transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }} className="absolute z-40 top-[38%] left-[-2%] xl:-left-[8%] group">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-indigo-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"/>
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
                            <motion.div animate={{ y:[-4, 6, -4] }} transition={{ duration:6, repeat:Infinity, ease:"easeInOut" }} className="absolute z-40 bottom-[20%] left-[8%] xl:left-[2%] group">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-blue-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    <div className="text-[85px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] rotate-[-20deg]">📒</div>
                                    <div className="absolute -right-4 -bottom-2 px-3 py-1 bg-blue-50 text-blue-700 font-bold text-[13px] rounded-lg shadow-md border border-blue-100 rotate-[5deg] z-10">Notebook</div>
                                </div>
                            </motion.div>

                            {/* 4. Bottle */}
                            <motion.div animate={{ y:[4, -6, 4] }} transition={{ duration:4.5, repeat:Infinity, ease:"easeInOut" }} className="absolute z-40 top-[12%] right-[5%] xl:-right-[2%] group hidden sm:block">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-pink-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    <div className="w-[70px] h-[150px] bg-[#1a1a1a] rounded-full shadow-[0_20px_40px_-5px_rgba(0,0,0,0.25)] rotate-[15deg] flex flex-col items-center justify-start border-4 border-[#121212]">
                                        <div className="w-[36px] h-[18px] bg-[#222] rounded-t-xl -mt-5 border-2 border-[#121212] z-10" />
                                        <div className="w-full h-full bg-gradient-to-tr from-black/80 via-white/10 to-white/30 rounded-full mix-blend-overlay"/>
                                    </div>
                                    <div className="absolute top-[35px] -right-16 px-3 py-1 bg-pink-50 text-pink-700 font-bold text-[13px] rounded-lg shadow-md border border-pink-200 rotate-[-5deg] z-10">Bottle</div>
                                </div>
                            </motion.div>

                            {/* 5. Wallet */}
                            <motion.div animate={{ y:[-5, 5, -5] }} transition={{ duration:5.2, repeat:Infinity, ease:"easeInOut" }} className="absolute z-40 top-[42%] right-[-2%] xl:-right-[8%] group hidden sm:block">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-6 bg-orange-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    <div className="w-28 h-24 bg-gradient-to-b from-[#7c4d33] to-[#593522] rounded-[18px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.25)] rotate-[-15deg] p-1.5 border-t border-l border-[#9e6749]">
                                        <div className="w-full h-full bg-gradient-to-br from-[#4a2b1b] to-[#361e12] rounded-xl relative overflow-hidden shadow-inner border border-[#301a0e]">
                                            <div className="absolute right-0 top-1/2 w-8 h-8 bg-[#29170e] rounded-l-full -translate-y-1/2 shadow-[inset_4px_0_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 ml-1.5 shadow-sm border border-yellow-700/50"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 right-2 px-3 py-1 bg-orange-50 text-orange-700 font-bold text-[13px] rounded-lg shadow-md border border-orange-200 rotate-[8deg] z-10">Wallet</div>
                                </div>
                            </motion.div>

                            {/* 6. ID Card */}
                            <motion.div animate={{ y:[3, -3, 3] }} transition={{ duration:4.8, repeat:Infinity, ease:"easeInOut" }} className="absolute z-40 bottom-[22%] right-[2%] xl:-right-[4%] group hidden sm:flex">
                                <div className="relative hover:scale-105 transition-transform">
                                    <div className="absolute -inset-4 bg-pink-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"/>
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
                                                    <span className="font-bold text-[15px]">CampusFind</span>
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
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
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
`;

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('{/* Hero Section */}')) {
        startIndex = i;
    }
    if (startIndex !== -1 && i > startIndex && lines[i].includes('</section>')) {
        endIndex = i;
        break;
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    const output = [
        ...lines.slice(0, startIndex),
        newHero,
        ...lines.slice(endIndex + 1)
    ];
    fs.writeFileSync(filePath, output.join('\n'), 'utf-8');
    console.log('Successfully refined hero section');
} else {
    console.log('Could not find boundaries for replacement', { startIndex, endIndex });
}
