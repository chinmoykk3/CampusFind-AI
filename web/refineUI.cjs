const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Refine Horizontal Feature Grid Cards
content = content.replace(
    /hover:bg-white dark:hover:bg-stone-900 p-4 rounded-xl transition-all shadow-sm hover:shadow-md md:text-left text-center/g,
    'hover:bg-white dark:hover:bg-stone-900 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] md:text-left text-center border border-transparent hover:border-stone-200 dark:hover:border-stone-700'
);

// 2. Refine Bento Grid Master Card
content = content.replace(
    /className="col-span-12 lg:col-span-8 bg-stone-50 dark:bg-stone-900\/30 border border-stone-200 dark:border-stone-800\/80 rounded-2xl p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl hover:border-stone-300 dark:hover:border-stone-700 transition-colors"/g,
    'className="col-span-12 lg:col-span-8 bg-gradient-to-br from-stone-50 to-white dark:from-stone-900/60 dark:to-stone-950 border border-stone-200/80 dark:border-stone-800/80 rounded-[32px] p-8 sm:p-14 flex flex-col justify-center relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-500"'
);

// 3. Refine Secondary Bento Grid Cards
content = content.replace(
    /className="bg-white dark:bg-\[#09090b\] rounded-2xl p-8 flex-1 flex flex-col justify-center border border-stone-200 dark:border-stone-800\/80 shadow-sm hover:shadow-lg cursor-pointer group transition-colors"/g,
    'className="bg-white dark:bg-[#09090b] rounded-[28px] p-8 flex-1 flex flex-col justify-center border border-stone-200/80 dark:border-stone-800/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] cursor-pointer group transition-all duration-500 hover:-translate-y-1"'
);

// 4. Refine Trust Section
content = content.replace(
    /className="w-full bg-stone-50 dark:bg-stone-900\/40 border border-stone-200 dark:border-stone-800\/60 rounded-3xl p-8 sm:p-12 lg:p-16 relative transition-colors"/g,
    'className="w-full bg-gradient-to-b from-stone-50 to-stone-100/50 dark:from-stone-900/40 dark:to-stone-950/40 border border-stone-200 dark:border-stone-800/60 rounded-[40px] p-8 sm:p-12 lg:p-20 relative transition-colors overflow-hidden"'
);

content = content.replace(
    /className="bg-white border border-stone-200 p-8 rounded-2xl shadow-sm hover:border-stone-300"/g,
    'className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800/50 p-10 rounded-[28px] shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] hover:border-primary-100 dark:hover:border-primary-900/50 transition-all duration-300 group"'
);

// 5. Refine Testimonial Cards
content = content.replace(
    /className="premium-card bg-white p-8 border border-stone-200 group cursor-pointer shadow-sm hover:shadow-lg transition-all rounded-3xl"/g,
    'className="premium-card bg-white dark:bg-stone-950 p-10 border border-stone-200 dark:border-stone-800 group cursor-pointer shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[32px] hover:-translate-y-2"'
);

// 6. Refine Product Workflow App Wrapper (Give it macOS dots and better styling)
content = content.replace(
    /className="w-full bg-white dark:bg-\[#09090b\] rounded-2xl border border-stone-200 dark:border-stone-800\/80 overflow-hidden shadow-sm relative z-10 transition-colors"/g,
    'className="w-full bg-white dark:bg-[#09090b] rounded-3xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative z-10 transition-colors"'
);
content = content.replace(
    /className="bg-white dark:bg-\[#09090b\] border-b border-stone-200 dark:border-stone-800\/80 px-6 py-4 flex justify-between items-center transition-colors"/g,
    `className="bg-stone-50/80 dark:bg-[#09090b] border-b border-stone-200/80 dark:border-stone-800/80 px-6 pt-5 pb-0 flex flex-col sm:flex-row justify-between items-center transition-colors relative backdrop-blur-md"
                             >
                                <div className="absolute top-4 left-5 hidden sm:flex gap-1.5 opacity-80">
                                    <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20" />
                                </div>
                                <div className="w-full pl-0 sm:pl-16 flex justify-between items-end`
);
content = content.replace(
    /className="hidden sm:flex text-sm text-stone-500 items-center gap-2"/g,
    'className="hidden sm:flex text-[13px] text-stone-400 font-medium items-center gap-2 mb-4"'
);

// 7. Refine Workflow App Row Items
content = content.replace(
    /className="bg-white dark:bg-stone-900\/40 p-4 rounded-xl border border-stone-200 dark:border-stone-800\/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"/g,
    'className="bg-white dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors shadow-sm hover:shadow-md"'
);
content = content.replace(
    /className="bg-white dark:bg-stone-900\/40 p-4 rounded-xl border border-stone-200 dark:border-stone-800\/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden transition-all hover:border-emerald-200 dark:hover:border-emerald-500\/30"/g,
    'className="bg-white dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.15)]"'
);

fs.writeFileSync(filePath, content);
console.log('UI Refinement applied successfully!');
