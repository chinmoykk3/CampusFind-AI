import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, MapPin, AlignLeft, Calendar, Tag, ArrowRight, CheckCircle2, Loader2, Info, Navigation2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});
import api from '../api/axios';
import toast from 'react-hot-toast';

function LocationMarker({ position, setPosition, locateTrigger }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    useEffect(() => {
        if ("geolocation" in navigator) {
            // Only show toast if it's a manual trigger (locateTrigger > 0)
            if (locateTrigger > 0) toast.loading("Acquiring GPS Signal...", { id: 'gps' });

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setPosition(latlng);
                    map.flyTo(latlng, 17, { animate: true, duration: 1.5 });
                    if (locateTrigger > 0) toast.success("Location locked!", { id: 'gps' });
                },
                (err) => {
                    console.warn(`Geolocation error: ${err.message}`);
                    if (locateTrigger > 0) toast.error("Please enable Location in your browser", { id: 'gps' });
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, [map, setPosition, locateTrigger]);

    return position === null ? null : <Marker position={position}></Marker>;
}

const ReportItem = () => {
    const { type } = useParams(); // 'lost', 'found', or 'new'
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Default to 'lost' if navigating from '/report/new'
    const [reportType, setReportType] = useState(type === 'found' ? 'found' : 'lost');
    const isLost = reportType === 'lost';

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [locateTrigger, setLocateTrigger] = useState(0);

    const [formData, setFormData] = useState({
        itemName: '',
        categoryId: '',
        description: '',
        locationId: '',
        date: '',
        latitude: '',
        longitude: ''
    });

    const setCoordinates = (latlng) => {
        setFormData(prev => ({
            ...prev,
            latitude: latlng.lat,
            longitude: latlng.lng
        }));
    };

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
            submitData.append('type', reportType);
            submitData.append('itemName', formData.itemName);
            submitData.append('categoryId', formData.categoryId);
            submitData.append('description', formData.description);
            submitData.append('date', formData.date);
            submitData.append('locationId', formData.locationId);

            if (formData.latitude && formData.longitude) {
                submitData.append('latitude', formData.latitude);
                submitData.append('longitude', formData.longitude);
            }

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
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center sm:text-left"
                >
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${isLost
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-green-800 border-green-200'
                        }`}>
                        {isLost ? 'Lost Item Report' : 'Found Item Report'}
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-primary-900 tracking-tight">
                        {isLost ? "Tell us what you've lost" : "Help reunite an item with its owner"}
                    </h1>
                    <p className="mt-3 text-slate-600 font-medium">
                        Our AI engine uses semantics, visual descriptors, and timing attributes to instantly map potential matches across campus.
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="premium-card bg-white shadow-sm overflow-hidden"
                >
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                        <motion.div
                            className="bg-primary-600 h-full rounded-r-full"
                            initial={{ width: '33%' }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ ease: "easeInOut", duration: 0.5 }}
                        />
                    </div>

                    <div className="p-6 sm:p-10">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-900 border-b border-slate-100 pb-4">
                                    <Tag className="w-5 h-5 text-primary-600" />
                                    Basic Information
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-primary-900 mb-3">Report Type</label>
                                        <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-sm">
                                            <button
                                                type="button"
                                                onClick={() => setReportType('lost')}
                                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${reportType === 'lost'
                                                    ? 'bg-white text-amber-600 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                I Lost Something
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setReportType('found')}
                                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${reportType === 'found'
                                                    ? 'bg-white text-green-700 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                I Found Something
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-primary-900 mb-2">Item Name</label>
                                        <input
                                            type="text"
                                            name="itemName"
                                            value={formData.itemName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Black Lenovo Thinkpad, Blue Yeti Mug"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-primary-900 mb-2">Category</label>
                                        <select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="">Select the primary category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100 mt-4">
                                        <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-primary-900">
                                            Be as specific as possible. The AI engine weights exact model names and specific colors significantly higher during matches.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-900 border-b border-slate-100 pb-4">
                                    <AlignLeft className="w-5 h-5 text-primary-600" />
                                    Details & Location
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-primary-900 mb-2">
                                            Description & Identifying Marks
                                        </label>
                                        <textarea
                                            rows={3}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Write out any unique scratches, stickers, serial numbers, or internal contents..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-bold text-primary-900 mb-2 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-500" /> Campus Location</label>
                                            <select
                                                name="locationId"
                                                value={formData.locationId}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                            >
                                                <option value="">Select Area</option>
                                                {locations.map((loc) => (
                                                    <option key={loc._id} value={loc._id}>{loc.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-primary-900 mb-2 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-500" /> Date Occurred</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2 relative z-0 mt-4">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2 gap-2">
                                                <div>
                                                    <label className="text-sm font-bold text-primary-900 flex items-center gap-1.5"><Navigation2 className="w-4 h-4 text-primary-600" /> Precise AI Spatial Map (Optional)</label>
                                                    <p className="text-xs text-slate-500 font-medium mt-1">Tap on the map exactly where you {isLost ? 'lost' : 'found'} the item. The AI will use standard Haversine mathematical formulas to match cases within 50 meters.</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setLocateTrigger(Date.now())}
                                                    className="shrink-0 px-3 py-1.5 bg-blue-50 text-blue-700 text-[11px] uppercase tracking-wider font-extrabold rounded-lg border border-blue-200 hover:bg-blue-100 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                                                >
                                                    <Navigation2 className="w-3.5 h-3.5" /> Locate Device
                                                </button>
                                            </div>
                                            <div className="h-[240px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner z-[0]">
                                                {/* Center on a default random coordinates or default to campus coordinates */}
                                                <MapContainer center={[28.6139, 77.2090]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 0 }}>
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <LocationMarker
                                                        position={formData.latitude ? { lat: formData.latitude, lng: formData.longitude } : null}
                                                        setPosition={setCoordinates}
                                                        locateTrigger={locateTrigger}
                                                    />
                                                </MapContainer>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-primary-900 mb-2 flex items-center gap-1.5"><Camera className="w-4 h-4 text-slate-500" /> Upload Image Evidence</label>
                                        <div className="relative w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer overflow-hidden group outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:border-transparent">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                aria-label="Upload an image"
                                            />
                                            {imageFile ? (
                                                <p className="text-sm font-bold text-emerald-600 flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    Attached: {imageFile.name}
                                                </p>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Camera className="w-6 h-6 text-slate-500 group-hover:text-primary-600 transition-colors" />
                                                    <p className="text-sm font-semibold text-primary-600">
                                                        Click or drag an image here
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-medium">JPEG, PNG up to 5MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center flex flex-col items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                >
                                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                                    </div>
                                </motion.div>
                                <h2 className="text-3xl font-extrabold text-primary-900 mb-3 tracking-tight">Report Logged Successfully</h2>
                                <p className="text-lg text-slate-600 mb-10 max-w-md font-medium">
                                    The CampusFind engine is now mapping semantics and tracking your report globally. View live AI matches on your dashboard.
                                </p>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="premium-button px-8 py-3.5 outline-none focus-visible:ring-4 focus-visible:ring-primary-100"
                                >
                                    Return to Dashboard
                                </button>
                            </motion.div>
                        )}

                        {/* Footer Actions */}
                        {step < 3 && (
                            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center bg-white">
                                <button
                                    onClick={prevStep}
                                    disabled={step === 1 || isSubmitting}
                                    className={`px-6 py-3 rounded-lg font-bold text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${step === 1 ? 'opacity-0 pointer-events-none' : 'secondary-button'
                                        }`}
                                >
                                    Go Back
                                </button>

                                <button
                                    onClick={step === 2 ? handleSubmit : nextStep}
                                    disabled={isSubmitting}
                                    className="premium-button flex items-center gap-2 px-8 py-3 text-sm font-bold shadow-sm active:scale-95 disabled:opacity-75 outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : step === 2 ? 'Submit to Index' : 'Continue'}
                                    {step === 1 && <ArrowRight className="w-4 h-4 ml-1" />}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div >
        </div >
    );
};

export default ReportItem;
