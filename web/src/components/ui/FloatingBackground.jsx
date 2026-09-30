import React from 'react';
import { motion } from 'framer-motion';

const backgroundStickers = [
    // Top section (around feature grid)
    { type: 'emoji', icon: '👓', label: 'Glasses', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', shadow: 'bg-indigo-400/20', top: '22%', left: '6%', rotate: '-12deg', y: [-5, 5, -5], duration: 5, scale: 'scale-90', blur: 'blur-[1px]' },
    { type: 'emoji', icon: '☂️', label: 'Umbrella', color: 'bg-blue-50 text-blue-700 border-blue-100', shadow: 'bg-blue-400/20', top: '28%', right: '5%', rotate: '15deg', y: [4, -4, 4], duration: 4.5, scale: 'scale-75', blur: 'blur-[2px]' },
    { type: 'emoji', icon: '🧢', label: 'Hat', color: 'bg-red-50 text-red-700 border-red-100', shadow: 'bg-red-400/20', top: '20%', left: '85%', rotate: '-8deg', y: [-3, 4, -3], duration: 5.2, scale: 'scale-100', blur: 'blur-[1px]' },
    { type: 'emoji', icon: '📖', label: 'Novel', color: 'bg-teal-50 text-teal-700 border-teal-100', shadow: 'bg-teal-400/20', top: '35%', left: '2%', rotate: '18deg', y: [-6, 6, -6], duration: 6.5, scale: 'scale-75', blur: 'blur-[2px]' },

    // Middle section (around Bento Grid & Workflow)
    { type: 'emoji', icon: '⌚', label: 'Watch', color: 'bg-stone-50 text-stone-700 border-stone-200', shadow: 'bg-stone-400/20', top: '48%', left: '3%', rotate: '8deg', y: [-4, 6, -4], duration: 6, scale: 'scale-100', blur: 'blur-0' },
    { type: 'emoji', icon: '🎧', label: 'Headphones', color: 'bg-rose-50 text-rose-700 border-rose-100', shadow: 'bg-rose-400/20', top: '56%', right: '4%', rotate: '-10deg', y: [6, -6, 6], duration: 5.5, scale: 'scale-90', blur: 'blur-[1px]' },
    { type: 'emoji', icon: '💻', label: 'Laptop', color: 'bg-slate-50 text-slate-700 border-slate-200', shadow: 'bg-slate-400/20', top: '65%', left: '7%', rotate: '-15deg', y: [-8, 8, -8], duration: 7, scale: 'scale-[0.85]', blur: 'blur-[1.5px]' },
    { type: 'emoji', icon: '👟', label: 'Sneaker', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100', shadow: 'bg-fuchsia-400/20', top: '44%', right: '8%', rotate: '25deg', y: [-4, 5, -4], duration: 4.8, scale: 'scale-90', blur: 'blur-[2px]' },
    { type: 'emoji', icon: '🛹', label: 'Board', color: 'bg-yellow-50 text-yellow-700 border-yellow-100', shadow: 'bg-yellow-400/20', top: '52%', left: '15%', rotate: '-22deg', y: [5, -5, 5], duration: 5.8, scale: 'scale-75', blur: 'blur-[2px]' },
    { type: 'emoji', icon: '💳', label: 'Bank Card', color: 'bg-sky-50 text-sky-700 border-sky-100', shadow: 'bg-sky-400/20', top: '70%', right: '12%', rotate: '14deg', y: [-3, 3, -3], duration: 6.2, scale: 'scale-[0.8]', blur: 'blur-[1px]' },

    // Bottom section (around Trust & Security / Testimonials)
    { type: 'emoji', icon: '🎒', label: 'Backpack', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', shadow: 'bg-emerald-400/20', top: '78%', right: '9%', rotate: '12deg', y: [-5, 5, -5], duration: 4.8, scale: 'scale-110', blur: 'blur-0' },
    { type: 'emoji', icon: '☕', label: 'Mug', color: 'bg-orange-50 text-orange-700 border-orange-100', shadow: 'bg-orange-400/20', top: '88%', left: '5%', rotate: '-8deg', y: [3, -3, 3], duration: 4, scale: 'scale-75', blur: 'blur-[2px]' },
    { type: 'emoji', icon: '📱', label: 'Phone', color: 'bg-cyan-50 text-cyan-700 border-cyan-100', shadow: 'bg-cyan-400/20', top: '95%', right: '6%', rotate: '18deg', y: [-6, 6, -6], duration: 5.2, scale: 'scale-95', blur: 'blur-[1px]' },
    { type: 'emoji', icon: '📸', label: 'Camera', color: 'bg-purple-50 text-purple-700 border-purple-100', shadow: 'bg-purple-400/20', top: '82%', left: '18%', rotate: '-12deg', y: [-4, 4, -4], duration: 5, scale: 'scale-[0.85]', blur: 'blur-[1px]' },
    { type: 'emoji', icon: '🔑', label: 'Keys', color: 'bg-lime-50 text-lime-700 border-lime-100', shadow: 'bg-lime-400/20', top: '92%', left: '25%', rotate: '20deg', y: [4, -4, 4], duration: 4.5, scale: 'scale-75', blur: 'blur-[2px]' },
];

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 hidden lg:block">
            {backgroundStickers.map((s, idx) => (
                <motion.div
                    key={idx}
                    animate={{ y: s.y }}
                    transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute z-0 group ${s.scale} ${s.blur} opacity-60 hover:opacity-100 hover:blur-none transition-all duration-500`}
                    style={{ top: s.top, left: s.left, right: s.right }}
                >
                    <div className="relative">
                        <div className={`absolute -inset-4 ${s.shadow} blur-xl rounded-full opacity-60`} />
                        <div className={`text-[65px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]`} style={{ transform: `rotate(${s.rotate})` }}>
                            {s.icon}
                        </div>
                        <div className={`absolute -bottom-4 right-0 px-3 py-1 ${s.color} font-bold text-[13px] rounded-lg shadow-md border rotate-[5deg] z-10`}>
                            {s.label}
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Random Ethereal blobs to create depth throughout the page */}
            <div className="absolute top-[30%] left-[80%] w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-[100px] opacity-70 mix-blend-multiply dark:mix-blend-overlay" />
            <div className="absolute top-[60%] left-[10%] w-[600px] h-[600px] bg-emerald-400/10 dark:bg-emerald-900/10 rounded-full blur-[100px] opacity-70 mix-blend-multiply dark:mix-blend-overlay" />
            <div className="absolute top-[85%] left-[70%] w-[400px] h-[400px] bg-amber-400/10 dark:bg-amber-900/10 rounded-full blur-[100px] opacity-70 mix-blend-multiply dark:mix-blend-overlay" />
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-400/10 dark:bg-blue-900/10 rounded-full blur-[120px] opacity-50 mix-blend-multiply dark:mix-blend-overlay" />
        </div>
    );
};

export default FloatingBackground;
