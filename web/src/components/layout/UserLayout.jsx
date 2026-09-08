import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10"
            >
                <Outlet />
            </motion.main>
        </div>
    );
};

export default UserLayout;
