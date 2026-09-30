import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api, { baseURL } from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
import tw from 'twrnc';

export default function ReportDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/' as any);
        }
    };

    useEffect(() => {
        if (!id) return;
        const fetchReport = async () => {
            try {
                const res = await api.get(`/reports/${id}`);
                setReport(res.data.data.report);
            } catch (error: any) {
                console.warn(`Failed specifically on ID: ${id}`);
                console.warn("Error payload:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={tw`flex-1 bg-black justify-center items-center`}>
                <ActivityIndicator size="large" color="#6366f1" />
            </SafeAreaView>
        );
    }

    if (!report) {
        return (
            <SafeAreaView style={tw`flex-1 bg-black justify-center items-center`}>
                <Text style={tw`text-slate-500 font-bold`}>Report not found</Text>
                <TouchableOpacity onPress={handleBack} style={tw`mt-4 px-4 py-2 bg-slate-800 rounded`}>
                    <Text style={tw`text-white`}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const { type, itemName, description, status, images, locationId, date, time } = report;
    const isFound = type === 'found';

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center px-4 py-4 absolute z-10 w-full`}>
                <TouchableOpacity onPress={handleBack} style={tw`p-2 bg-black/60 rounded-full border border-white/10`}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-white font-bold text-lg ml-4 shadow-lg capitalize`}>{type} Telemetry</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {images && images.length > 0 ? (
                    <Image
                        source={{ uri: `${baseURL.replace('/api', '')}${images[0].url}` }}
                        style={tw`w-full h-72`}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={tw`w-full h-72 bg-slate-900 justify-center items-center`}>
                        <Ionicons name="image-outline" size={64} color="#334155" />
                        <Text style={tw`text-slate-500 mt-2`}>No Visual Evidence</Text>
                    </View>
                )}

                <View style={tw`p-6 -mt-6 bg-black rounded-t-[32px]`}>
                    <View style={tw`flex-row justify-between items-center mb-2`}>
                        <View style={tw`flex-row items-center`}>
                            <Ionicons name={isFound ? 'add-circle' : 'search'} size={18} color={isFound ? '#34d399' : '#f43f5e'} />
                            <Text style={tw`text-slate-400 ml-2 font-bold text-xs uppercase tracking-wider`}>
                                {type} Asset
                            </Text>
                        </View>
                        <View style={tw`bg-${status === 'open' ? 'indigo' : 'emerald'}-500/20 px-3 py-1 rounded-full`}>
                            <Text style={tw`text-${status === 'open' ? 'indigo' : 'emerald'}-400 text-xs font-bold uppercase`}>{status}</Text>
                        </View>
                    </View>

                    <Text style={tw`text-white font-extrabold text-3xl mb-4`}>{itemName}</Text>

                    <View style={tw`flex-row flex-wrap mb-6 border-b border-white/10 pb-6`}>
                        <View style={tw`flex-row items-center w-1/2 mb-3`}>
                            <View style={tw`w-8 h-8 rounded-full bg-slate-900 justify-center items-center mr-3`}>
                                <Ionicons name="location" size={16} color="#94a3b8" />
                            </View>
                            <View>
                                <Text style={tw`text-slate-500 text-xs font-bold uppercase`}>Last Known</Text>
                                <Text style={tw`text-slate-300 font-medium`}>{locationId?.name || 'Unknown'}</Text>
                            </View>
                        </View>

                        <View style={tw`flex-row items-center w-1/2 mb-3`}>
                            <View style={tw`w-8 h-8 rounded-full bg-slate-900 justify-center items-center mr-3`}>
                                <Ionicons name="calendar" size={16} color="#94a3b8" />
                            </View>
                            <View>
                                <Text style={tw`text-slate-500 text-xs font-bold uppercase`}>Date Filed</Text>
                                <Text style={tw`text-slate-300 font-medium`}>{date}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>Detailed Description</Text>
                    <Text style={tw`text-slate-300 leading-relaxed text-base`}>{description}</Text>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
