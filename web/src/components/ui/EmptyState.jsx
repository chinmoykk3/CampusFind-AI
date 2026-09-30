import React from 'react';
import { motion } from 'framer-motion';

export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20"
        >
            <div className="w-16 h-16 mb-4 rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                <Icon className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {action && (
                <div>{action}</div>
            )}
        </motion.div>
    );
}
