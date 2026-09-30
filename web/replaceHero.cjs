const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const newHero = `                {/* Hero Section */}
                <section className="relative w-full overflow-hidden pt-10 sm:pt-14 lg:pt-20 pb-16">
                    {/* Abstract Ethereal Background Blobs */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] rounded-full bg-indigo-50/60 dark:bg-indigo-900/20 blur-3xl opacity-70" />
                        <div className="absolute top-[20%] -right-[5%] w-[40%] h-[50%] rounded-full bg-pink-50/60 dark:bg-pink-900/20 blur-3xl opacity-70" />
                        <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[40%] rounded-full bg-purple-50/60 dark:bg-purple-900/20 blur-3xl opacity-70" />
                        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[45%] rounded-full bg-blue-50/60 dark:bg-blue-900/20 blur-3xl opacity-70" />
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
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 mb-6 shadow-sm border border-emerald-100 dark:border-emerald-800/50"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                CampusFind 2.0 is live
                                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="font-display font-black tracking-[-0.04em] leading-[1.05] text-[#1a1a1a] dark:text-white text-[56px] sm:text-[68px] lg:text-[76px] xl:text-[84px] mb-6 relative"
                            >
                                <span className="block">Small things</span>
                                <span className="block">lose track.</span>
                                <span className="block text-[#3B54F4] dark:text-[#5C73F2] relative w-fit">
                                    We bring
                                    <span className="block">them back.</span>
                                    {/* Squiggle underline */}
                                    <svg className="absolute w-full -bottom-2 sm:-bottom-4 left-0 h-4 sm:h-6 text-[#9A73FF]" viewBox="0 0 200 20" preserveAspectRatio="none">
                                        <path d="M0 10 Q 25 20, 50 10 T 100 10 T 150 10 T 200 10" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
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
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/report/found"
                                    className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border-2 border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 px-7 text-[15px] font-semibold text-[#111111] dark:text-white transition-transform hover:scale-[1.02] shadow-sm hover:border-stone-200"
                                >
                                    <span className="text-[#9A73FF]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                    </span>
                                    Submit Found Item
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, filter: "blur(4px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex items-center gap-8 bg-white/70 dark:bg-stone-900/70 p-4 rounded-2xl shadow-sm border border-white dark:border-stone-800 backdrop-blur-sm w-fit"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-bold text-[#111111] dark:text-white leading-tight">1.2K+</p>
                                        <p className="text-[12px] font-medium text-stone-500">Items recovered</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-stone-200 dark:bg-stone-800" />
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-bold text-[#111111] dark:text-white leading-tight">8</p>
                                        <p className="text-[12px] font-medium text-stone-500">Campuses</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-stone-200 dark:bg-stone-800" />
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[18px] font-bold text-[#111111] dark:text-white leading-tight">98%</p>
                                        <p className="text-[12px] font-medium text-stone-500">Match accuracy</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right — Product Composition & Collage Layout */}
                        <div className="relative w-full min-h-[700px] flex items-center justify-center -ml-4 lg:-ml-0 scale-90 sm:scale-100">
                            
                            {/* Floating Handwritten Notes */}
                            <div className="absolute top-[8%] right-[5%] z-20 hidden md:block">
                                <div className="relative rotate-[8deg]">
                                    <p className="text-[#3B54F4] text-xl font-medium tracking-wide whitespace-nowrap" style={{ fontFamily:'"Architects Daughter", cursive, "Englebert"' }}>
                                        Lost on campus?<br/>Found on CampusFind.
                                    </p>
                                    <svg className="absolute -bottom-6 left-12 w-12 h-12 text-[#3B54F4] transform -scale-x-100" viewBox="0 0 50 50" fill="none">
                                        <path d="M40 10 Q 20 20, 10 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                        <path d="M10 40 L 15 30 M 10 40 L 22 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="absolute bottom-[5%] left-[8%] z-20 hidden md:block">
                                <div className="relative -rotate-[6deg]">
                                    <p className="text-[#9A73FF] text-lg font-medium tracking-wide" style={{ fontFamily:'"Architects Daughter", cursive, "Englebert"' }}>
                                        Same campus.<br/>Brighter days.
                                    </p>
                                    <svg className="absolute top-2 -right-8 w-12 h-8 text-[#9A73FF]" viewBox="0 0 50 20" fill="none">
                                        <path d="M0 10 Q 25 -5, 45 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                        <path d="M45 10 L 35 5 M 45 10 L 38 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute bottom-[2%] right-[2%] z-20 hidden md:block">
                                <div className="relative rotate-[4deg]">
                                    <p className="text-[#3B54F4] text-lg font-medium tracking-wide" style={{ fontFamily:'"Architects Daughter", cursive, "Englebert"' }}>
                                        Different items.<br/>Same stories.
                                    </p>
                                    <svg className="absolute -top-8 -left-6 w-12 h-10 text-[#3B54F4]" viewBox="0 0 40 40" fill="none">
                                        <path d="M30 35 Q 15 25, 10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                        <path d="M10 5 L 18 12 M 10 5 L 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Floating Stickers */}
                            {/* 1. Keys */}
                            <motion.div animate={{ y:[-5, 5, -5] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }} className="absolute z-30 top-[18%] left-[6%]">
                                <div className="relative">
                                    <div className="text-[50px] drop-shadow-xl rotate-[15deg]">🔑<span className="absolute -bottom-2 -right-3 text-[30px] rotate-[-20deg]">😊</span></div>
                                    <div className="absolute -right-12 top-4 px-3 py-1 bg-purple-100 text-purple-700 font-bold text-sm rounded-lg shadow-sm border border-purple-200 rotate-[8deg]">Keys</div>
                                </div>
                            </motion.div>

                            {/* 2. Earbuds */}
                            <motion.div animate={{ y:[5, -5, 5] }} transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }} className="absolute z-30 top-[40%] left-[8%]">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-stone-100 flex items-center justify-center rotate-[-12deg]">
                                        <div className="w-14 h-12 bg-stone-100 rounded-2xl shadow-inner relative border border-stone-200">
                                            <div className="absolute top-1/2 left-2 w-3 h-5 bg-white rounded-full shadow border-stone-200 border" />
                                            <div className="absolute top-1/2 right-2 w-3 h-5 bg-white rounded-full shadow border-stone-200 border" />
                                        </div>
                                    </div>
                                    <div className="absolute -top-6 -left-6 px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-sm rounded-lg shadow-sm border border-indigo-200 rotate-[-5deg]">Earbuds</div>
                                </div>
                            </motion.div>
                            
                            {/* 3. Notebook */}
                            <motion.div animate={{ y:[-4, 6, -4] }} transition={{ duration:6, repeat:Infinity, ease:"easeInOut" }} className="absolute z-20 bottom-[22%] left-[10%]">
                                <div className="relative">
                                    <div className="text-[80px] drop-shadow-2xl rotate-[-20deg]">📒</div>
                                    <div className="absolute -right-4 -bottom-4 px-3 py-1 bg-blue-100 text-blue-700 font-bold text-sm rounded-lg shadow-sm border border-blue-200 rotate-[5deg]">Notebook</div>
                                </div>
                            </motion.div>

                            {/* 4. Bottle */}
                            <motion.div animate={{ y:[4, -6, 4] }} transition={{ duration:4.5, repeat:Infinity, ease:"easeInOut" }} className="absolute z-30 top-[15%] right-[9%]">
                                <div className="relative">
                                    <div className="w-16 h-36 bg-zinc-800 rounded-full shadow-2xl rotate-[15deg] flex flex-col items-center justify-start border-4 border-zinc-700 hidden sm:flex">
                                        <div className="w-8 h-4 bg-zinc-900 rounded-t-lg -mt-4 border-2 border-zinc-700" />
                                        <div className="w-full h-full bg-gradient-to-tr from-black via-zinc-800 to-zinc-600 rounded-full opacity-60 mix-blend-overlay"/>
                                    </div>
                                    <div className="absolute top-8 -right-16 px-3 py-1 bg-pink-100 text-pink-700 font-bold text-sm rounded-lg shadow-sm border border-pink-200 rotate-[-5deg]">Bottle</div>
                                </div>
                            </motion.div>

                            {/* 5. Wallet */}
                            <motion.div animate={{ y:[-5, 5, -5] }} transition={{ duration:5.2, repeat:Infinity, ease:"easeInOut" }} className="absolute z-20 top-[45%] right-[2%]">
                                <div className="relative">
                                    <div className="w-24 h-20 bg-[#6E4228] rounded-xl shadow-2xl rotate-[-15deg] p-1 border-t-2 border-[#8A5A3B] hidden sm:block">
                                        <div className="w-full h-full bg-[#5C341C] rounded-lg relative overflow-hidden">
                                            <div className="absolute right-0 top-1/2 w-6 h-6 bg-[#3D2111] rounded-l-full -translate-y-1/2 shadow-inner flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-yellow-600 ml-1 mt-2"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 right-2 px-3 py-1 bg-orange-100 text-orange-700 font-bold text-sm rounded-lg shadow-sm border border-orange-200 rotate-[8deg]">Wallet</div>
                                </div>
                            </motion.div>

                            {/* 6. ID Card */}
                            <motion.div animate={{ y:[3, -3, 3] }} transition={{ duration:4.8, repeat:Infinity, ease:"easeInOut" }} className="absolute z-40 bottom-[28%] right-[5%]">
                                <div className="relative">
                                    <div className="w-24 h-32 bg-white rounded-xl shadow-2xl rotate-[10deg] p-2 border border-blue-500 overflow-hidden text-center relative hidden sm:flex flex-col items-center">
                                        <div className="w-full h-8 bg-blue-100 rounded-t-lg absolute top-0 left-0" />
                                        <div className="w-8 h-2 bg-zinc-300 rounded-full z-10 mb-2 shadow-inner" />
                                        <div className="w-10 h-10 bg-zinc-200 rounded-full z-10 mb-2 border-2 border-white shadow flex items-center justify-center text-[10px]">👤</div>
                                        <div className="w-14 h-2 bg-blue-100 rounded mb-1 z-10" />
                                        <div className="w-10 h-1.5 bg-stone-100 rounded mb-2 z-10" />
                                        <div className="w-full h-4 relative mt-auto z-10">
                                            <div className="w-full h-1 bg-zinc-800" />
                                            <div className="w-3/4 h-1 bg-zinc-800 mt-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 -right-12 px-3 py-1 bg-[#FFD1ED] text-pink-700 font-bold text-sm rounded-lg shadow-sm border border-pink-300 rotate-[-12deg]">ID Card</div>
                                </div>
                            </motion.div>


                            {/* Phone Mockup (Centerpiece) */}
                            <div className="relative z-30 w-[300px] h-[610px] rounded-[52px] bg-black shadow-[0_30px_60px_-10px_rgba(0,0,0,0.4),_0_0_0_2px_rgba(30,30,30,1),_0_0_0_8px_white] p-[5px]">
                                {/* Hardware buttons */}
                                <div className="absolute top-[120px] -left-[9px] w-[4px] h-[26px] bg-zinc-300 rounded-l-md" />
                                <div className="absolute top-[170px] -left-[9px] w-[4px] h-[45px] bg-zinc-300 rounded-l-md" />
                                <div className="absolute top-[230px] -left-[9px] w-[4px] h-[45px] bg-zinc-300 rounded-l-md" />
                                <div className="absolute top-[200px] -right-[9px] w-[4px] h-[65px] bg-zinc-300 rounded-r-md" />
                            
                                <div className="w-full h-full rounded-[45px] bg-white overflow-hidden relative">
                                    {/* Dynamic Island */}
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-50 flex items-center justify-end px-2">
                                        <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-800 opacity-80" />
                                    </div>

                                    {/* Screen Content Wrapper */}
                                    <div className="w-full h-full flex flex-col pt-12 pb-5 bg-white text-stone-900">
                                        
                                        {/* Header */}
                                        <div className="px-5 flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-[#3B54F4] text-white p-1 rounded">
                                                    <MapPin className="w-3 h-3" />
                                                </div>
                                                <span className="font-bold text-sm">CampusFind</span>
                                            </div>
                                            <div className="relative">
                                                <BellRing className="w-5 h-5 text-stone-500" />
                                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
                                            </div>
                                        </div>

                                        {/* Titles */}
                                        <div className="px-5 mb-5">
                                            <h2 className="text-[28px] font-black leading-[1.05] tracking-tight text-[#111111]">
                                                Find what
                                                <br />
                                                <span className="text-[#3B54F4]">matters.</span>
                                            </h2>
                                        </div>

                                        {/* Search Bar */}
                                        <div className="px-5 mb-5">
                                            <div className="w-full h-10 bg-stone-50 border border-stone-200 rounded-xl flex items-center px-3 text-stone-400">
                                                <Search className="w-4 h-4 mr-2" />
                                                <span className="text-[13px] font-medium">Search for items...</span>
                                            </div>
                                        </div>

                                        {/* Categories */}
                                        <div className="px-5 mb-6 flex justify-between">
                                            <div className="flex flex-col items-center gap-1 group">
                                                <div className="w-12 h-12 bg-[#3B54F4]/10 rounded-[14px] flex items-center justify-center shadow-sm">
                                                    <span className="text-xl text-[#3B54F4]" style={{ filter: 'drop-shadow(0 2px 4px rgba(59,84,244,0.3))' }}>✨</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-[#3B54F4]">All</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-12 h-12 bg-white border border-stone-200 rounded-[14px] flex items-center justify-center shadow-sm">
                                                    <span className="text-xl">📚</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-stone-600">Books</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-12 h-12 bg-white border border-stone-200 rounded-[14px] flex items-center justify-center shadow-sm">
                                                    <span className="text-xl">💻</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-stone-600">Devices</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-12 h-12 bg-white border border-stone-200 rounded-[14px] flex items-center justify-center shadow-sm">
                                                    <span className="text-xl">💳</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-stone-600">Cards</span>
                                            </div>
                                        </div>

                                        {/* Recent Activity */}
                                        <div className="px-5 flex-1 relative">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="font-bold text-[14px] text-[#111111]">Recent activity</h3>
                                                <span className="text-[11px] font-bold text-[#3B54F4]">See all</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center bg-white border border-stone-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] rounded-xl p-3 gap-3">
                                                    <div className="w-9 h-9 bg-stone-100 rounded-lg flex items-center justify-center text-lg">📱</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-[12px]">iPhone 14</h4>
                                                        <p className="text-[10px] text-stone-400 font-medium">Main Library • 2h ago</p>
                                                    </div>
                                                    <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200">Found</div>
                                                </div>
                                                <div className="flex items-center bg-white border border-stone-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] rounded-xl p-3 gap-3">
                                                    <div className="w-9 h-9 bg-stone-100 rounded-lg flex items-center justify-center text-lg">🎒</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-[12px]">Black Backpack</h4>
                                                        <p className="text-[10px] text-stone-400 font-medium">Student Union • 5h ago</p>
                                                    </div>
                                                    <div className="px-2 py-1 bg-blue-100 text-[#3B54F4] text-[10px] font-bold rounded-lg border border-[#3B54F4]/20">Matched</div>
                                                </div>
                                                <div className="flex items-center bg-white border border-stone-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] rounded-xl p-3 gap-3">
                                                    <div className="w-9 h-9 bg-stone-100 rounded-lg flex items-center justify-center text-lg">🪪</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-[12px]">Student ID Card</h4>
                                                        <p className="text-[10px] text-stone-400 font-medium">Academic Block • 1d ago</p>
                                                    </div>
                                                    <div className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-lg border border-orange-200">Pending</div>
                                                </div>
                                            </div>
                                            {/* Fade out bottom overlay */}
                                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"/>
                                        </div>

                                        {/* Bottom App Bar */}
                                        <div className="mt-auto pt-2 pb-2 px-6 flex justify-between items-end relative bg-white">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-6 h-6 flex items-center justify-center text-[#3B54F4]">
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                                                </div>
                                                <span className="text-[9px] font-bold text-[#3B54F4]">Home</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 opacity-50">
                                                <Search className="w-6 h-6" />
                                                <span className="text-[9px] font-bold">Search</span>
                                            </div>
                                            <div className="relative -top-4 w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white cursor-default">
                                                <Plus className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col items-center gap-1 opacity-50">
                                                <CheckCircle2 className="w-6 h-6" />
                                                <span className="text-[9px] font-bold">Matches</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 opacity-50">
                                                <User className="w-6 h-6" />
                                                <span className="text-[9px] font-bold">Profile</span>
                                            </div>
                                        </div>
                                        
                                        {/* iOS Home Indicator */}
                                        <div className="w-1/3 h-1 bg-zinc-900 rounded-full mx-auto" />
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
        break; // Match the first </section> after start
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    const output = [
        ...lines.slice(0, startIndex),
        newHero,
        ...lines.slice(endIndex + 1)
    ];
    fs.writeFileSync(filePath, output.join('\n'), 'utf-8');
    console.log('Successfully replaced hero section');
} else {
    console.log('Could not find boundaries for replacement', { startIndex, endIndex });
}
