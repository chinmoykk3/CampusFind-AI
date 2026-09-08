import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, MapPin, AlignLeft, Calendar, Tag, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ReportItem = () => {
    const { type } = useParams(); // 'lost' or 'found'
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const isLost = type === 'lost';

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        itemName: '',
        categoryId: '',
        description: '',
        locationId: '',
        date: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, locRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/locations')
                ]);
                setCategories(catRes.data.data);
                setLocations(locRes.data.data);
            } catch (error) {
                toast.error('Failed to load form details');
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!formData.itemName || !formData.categoryId)) {
            toast.error("Please fill required basic fields");
            return;
        }
        setStep((s) => Math.min(s + 1, 3));
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.description || !formData.locationId || !formData.date) {
            toast.error("Please fill all required details");
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('type', isLost ? 'lost' : 'found');
            submitData.append('itemName', formData.itemName);
            submitData.append('categoryId', formData.categoryId);
            submitData.append('description', formData.description);
            submitData.append('locationId', formData.locationId);
            submitData.append('date', formData.date);

            if (imageFile) {
                submitData.append('image', imageFile);
            }

            await api.post('/reports', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit report');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isLost ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'} border ${isLost ? 'border-amber-200 dark:border-amber-800' : 'border-emerald-200 dark:border-emerald-800'}`}>
                    {isLost ? 'Lost Item Report' : 'Found Item Report'}
                </span>
                <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                    {isLost ? "Tell us what you've lost" : "Help reunite an item with its owner"}
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Our AI engine uses semantics, vision, and timing attributes to instantly find potential matches.
                </p>
            </motion.div>

            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-panel rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-xl"
            >
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800/50 h-2">
                    <motion.div
                        className="bg-indigo-600 h-full"
                        initial={{ width: '33%' }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ ease: "easeInOut" }}
                    />
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-indigo-600" />
                                Basic Item Information
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={formData.itemName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Black Lenovo Thinkpad"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all dark:text-white"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <AlignLeft className="w-5 h-5 text-indigo-600" />
                                Details & Location
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex justify-between">
                                        <span>Description & Identifying Marks</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Has a scratch on the bottom left corner..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none dark:text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Location</label>
                                        <select
                                            name="locationId"
                                            value={formData.locationId}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all dark:text-white"
                                        >
                                            <option value="">Select Location</option>
                                            {locations.map((loc) => (
                                                <option key={loc._id} value={loc._id}>{loc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" /> Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><Camera className="w-4 h-4" /> Upload Photo</label>
                                    <div className="relative w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer overflow-hidden group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            title="Choose an image"
                                        />
                                        {imageFile ? (
                                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                Image Attached: {imageFile.name}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-slate-500 group-hover:text-indigo-600 transition-colors">
                                                Click to upload or drag image here
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center flex flex-col items-center justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                            >
                                <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Report Submitted!</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                                We've begun analyzing your report through our AI Engine. You can view your reports or AI matches in the dashboard.
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                            >
                                Return to Dashboard
                            </button>
                        </motion.div>
                    )}

                    {/* Footer Actions */}
                    {step < 3 && (
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                            <button
                                onClick={prevStep}
                                disabled={step === 1 || isSubmitting}
                                className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                            >
                                Back
                            </button>

                            <button
                                onClick={step === 2 ? handleSubmit : nextStep}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-medium shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-75"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : step === 2 ? 'Submit Report' : 'Continue'}
                                {step === 1 && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ReportItem;
