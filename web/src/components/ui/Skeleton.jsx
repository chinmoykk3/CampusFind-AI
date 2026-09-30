import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-800/60", className)}
            {...props}
        />
    );
}

export { Skeleton };
