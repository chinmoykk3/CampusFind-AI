import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../api/axios';
import tw from 'twrnc';

export default function NewReportScreen() {
    const { type } = useLocalSearchParams();
    const isFound = type === 'found';
    const router = useRouter();

    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    // For MVP prototyping without large selects, we'll hardcode one of the seeded category/location IDs
    // Assuming backend handles these properly, or we can fetch them. Let's use simple IDs.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!itemName.trim() || !description.trim()) {
            setError("Please fill out both item name and description.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Note: On physical deployments, categoryId and locationId would be fetched cleanly from API.
            // Sending standard payload string parameters allows backend validation to handle it safely or we supply mock valid IDs.
            // Alternatively, backend `report.controller.js` demands valid ObjectIDs. 
            // We will fetch real categories on mount. Let's fetch them now!
            const resCat = await api.get('/admin/categories');
            const resLoc = await api.get('/admin/locations');

            if (resCat.data.data.length === 0 || resLoc.data.data.length === 0) {
                throw new Error("Cannot report: Server has no valid categories/locations seeded.");
            }

            const payload = {
                type: isFound ? 'found' : 'lost',
                itemName,
                description,
                categoryId: resCat.data.data[0]._id, // using first available category via API
                locationId: resLoc.data.data[0]._id, // using first available location via API
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0].substring(0, 5),
                identifyingCharacteristics: [itemName.split(' ')[0], "Campus"]
            };

            await api.post('/reports', payload);

            // Redirect back to dashboard safely
            router.back();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to submit telemetry report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center px-4 py-4 border-b border-slate-800`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`p-2 bg-slate-900 rounded-full`}>
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

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading || !itemName || !description}
                        style={tw`w-full py-4 rounded-2xl flex-row justify-center items-center ${(!itemName || !description || loading) ? 'bg-indigo-900/50' : 'bg-indigo-600'
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
