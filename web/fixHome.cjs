const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The current content starts with '{ q: '
const missingPrefix = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, HandHeart, CheckCircle2, ChevronRight, ShieldCheck, BellRing, User, Clock, AlertCircle, ChevronDown, Activity, Phone, Plus, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeTab, setActiveTab] = useState('lost');
    const [recentFeeds, setRecentFeeds] = useState([]);

    const faqs = [
        { q: "How accurate is the AI matching?", a: "Our semantic engine scores based on description, color, brand, location, and time. Over 85% of matches suggested are highly accurate and lead to successful returns." },
        { q: "Who verifies the handovers?", a: "Only designated campus administrators or security personnel can approve final handovers after verifying student ID." },
        `;

content = missingPrefix + content;
fs.writeFileSync(filePath, content, 'utf-8');
console.log("Fixed Home.jsx");
