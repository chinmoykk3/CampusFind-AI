import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../api/axios';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';

export default function NewReportScreen() {
    const { type } = useLocalSearchParams();
    const isFound = type === 'found';
    const router = useRouter();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/' as any);
        }
    };

    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');

    // Dynamic Selection State
    const [categories, setCategories] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);

    React.useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [resCat, resLoc] = await Promise.all([
                    api.get('/categories'),
                    api.get('/locations')
                ]);
                setCategories(resCat.data.data);
                setLocations(resLoc.data.data);
            } catch (err) {
                console.warn("Failed to prefetch metadata", err);
            } finally {
                setLoadingData(false);
            }
        };
        fetchMetadata();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const handleSubmit = async () => {
        if (!itemName.trim() || !description.trim()) {
            setError("Please fill out both item name and description.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            if (!selectedCategory || !selectedLocation) {
                throw new Error("Please select a Category and Location.");
            }

            const formData = new FormData();
            formData.append('type', isFound ? 'found' : 'lost');
            formData.append('itemName', itemName);
            formData.append('description', description);
            formData.append('categoryId', selectedCategory);
            formData.append('locationId', selectedLocation);
            formData.append('date', new Date().toISOString().split('T')[0]);
            formData.append('time', new Date().toTimeString().split(' ')[0].substring(0, 5));
            formData.append('identifyingCharacteristics', itemName.split(' ')[0]);

            if (imageUri) {
                const localUri = imageUri;
                const filename = localUri.split('/').pop() || 'photo.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;
                formData.append('image', { uri: localUri, name: filename, type } as any);
            }

            await api.post('/reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Redirect back to dashboard safely
            handleBack();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to submit telemetry report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center px-4 py-4 border-b border-slate-800`}>
                <TouchableOpacity onPress={handleBack} style={tw`p-2 bg-slate-900 rounded-full`}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-white font-bold text-lg ml-4`}>
                    {isFound ? 'Initialize Found Report' : 'Initialize Lost Report'}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    <View style={tw`mb-8`}>
                        <Text style={tw`text-slate-400 font-bold uppercase tracking-widest text-xs mb-2 ml-1`}>
                            Report Type
                        </Text>
                        <View style={tw`flex-row items-center p-4 rounded-2xl border ${isFound ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'}`}>
                            <Ionicons name={isFound ? 'add-circle' : 'search'} size={24} color={isFound ? '#10b981' : '#f43f5e'} />
                            <Text style={tw`text-white font-bold text-lg ml-3 capitalize`}>
                                {isFound ? 'Found Physical Asset' : 'Missing Physical Asset'}
                            </Text>
                        </View>
                    </View>

                    {error && (
                        <View style={tw`bg-rose-500/20 p-4 rounded-2xl border border-rose-500/30 mb-6 flex-row items-center`}>
                            <Ionicons name="warning" size={20} color="#f43f5e" />
                            <Text style={tw`text-rose-400 ml-2 font-medium flex-1`}>{error}</Text>
                        </View>
                    )}

                    <View style={tw`mb-6`}>
                        <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>Asset Designation (Name)</Text>
                        <View style={tw`bg-slate-900 border border-slate-700 rounded-2xl px-4 py-4 focus:border-indigo-500`}>
                            <TextInput
                                style={tw`text-white text-base`}
                                placeholder="E.g. Matte Black Hydroflask"
                                placeholderTextColor="#475569"
                                value={itemName}
                                onChangeText={setItemName}
                            />
                        </View>
                    </View>

                    <View style={tw`mb-8`}>
                        <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>Detailed Characteristics</Text>
                        <View style={tw`bg-slate-900 border border-slate-700 rounded-2xl px-4 py-4 min-h-[120px]`}>
                            <TextInput
                                style={tw`text-white text-base text-left`}
                                placeholder="Identify brand, unique damage, color, etc."
                                placeholderTextColor="#475569"
                                multiline
                                textAlignVertical="top"
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>
                    </View>

                    {/* Metadata Selection */}
                    {!loadingData && (
                        <>
                            <View style={tw`mb-6`}>
                                <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>Asset Classification</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`py-2`}>
                                    {categories.map(cat => (
                                        <TouchableOpacity
                                            key={cat._id}
                                            onPress={() => setSelectedCategory(cat._id)}
                                            style={tw`mr-3 px-4 py-3 border rounded-xl ${selectedCategory === cat._id ? (isFound ? 'bg-emerald-600 border-emerald-500' : 'bg-indigo-600 border-indigo-500') : 'bg-slate-900 border-slate-700'}`}
                                        >
                                            <Text style={tw`font-bold ${selectedCategory === cat._id ? 'text-white' : 'text-slate-400'}`}>{cat.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={tw`mb-8`}>
                                <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>Known Spatial Location</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`py-2`}>
                                    {locations.map(loc => (
                                        <TouchableOpacity
                                            key={loc._id}
                                            onPress={() => setSelectedLocation(loc._id)}
                                            style={tw`mr-3 px-4 py-2.5 border rounded-xl ${selectedLocation === loc._id ? 'bg-slate-700 border-slate-500' : 'bg-slate-900 border-slate-700'}`}
                                        >
                                            <Text style={tw`font-bold ${selectedLocation === loc._id ? 'text-white' : 'text-slate-400'}`}>{loc.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </>
                    )}

                    <View style={tw`mb-8`}>
                        <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>Visual Evidence</Text>
                        <TouchableOpacity onPress={pickImage} style={tw`bg-slate-900 border border-slate-700 rounded-2xl items-center justify-center p-6 border-dashed`}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={tw`w-full h-40 rounded-xl mb-3`} />
                            ) : (
                                <Ionicons name="camera-outline" size={32} color="#64748b" style={tw`mb-2`} />
                            )}
                            <Text style={tw`text-slate-400 font-medium`}>{imageUri ? 'Tap to change photo' : 'Upload physical asset photo'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading || !itemName || !description || !selectedCategory || !selectedLocation}
                        style={tw`w-full py-4 rounded-2xl flex-row justify-center items-center ${(!itemName || !description || !selectedCategory || !selectedLocation || loading) ? 'bg-indigo-900/50' : 'bg-indigo-600'
                            }`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={tw`text-white font-bold text-lg mr-2`}>Transmit Telemetry</Text>
                                <Ionicons name="airplane" size={20} color="white" />
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
