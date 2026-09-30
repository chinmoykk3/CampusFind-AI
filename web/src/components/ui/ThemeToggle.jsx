import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors focus:outline-none"
            aria-label="Toggle theme"
        >
            <div className="relative h-5 w-5">
                <motion.div
                    initial={false}
                    animate={{ scale: theme === 'dark' ? 1 : 0, opacity: theme === 'dark' ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 text-slate-100"
                >
                    <Moon className="h-5 w-5" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{ scale: theme === 'dark' ? 0 : 1, opacity: theme === 'dark' ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 text-slate-900"
                >
                    <Sun className="h-5 w-5" />
                </motion.div>
            </div>
        </button>
    );
}
