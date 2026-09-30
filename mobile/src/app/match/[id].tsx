import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../api/axios';
import tw from 'twrnc';

export default function MatchResolutionScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [match, setMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/' as any);
        }
    };

    const fetchMatch = async () => {
        try {
            const res = await api.get('/matching');
            // The API returns all matches, we just filter for ours
            const foundMatch = res.data.data.find((m: any) => m._id === id);
            setMatch(foundMatch);
        } catch (error) {
            console.warn("Failed to fetch match details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatch();
    }, [id]);

    const handleAction = async (status: string) => {
        try {
            setActionLoading(true);
            await api.patch(`/matching/${id}`, { status });
            Alert.alert("Success", `Match successfully ${status}`);
            setMatch({ ...match, status });
        } catch (error) {
            Alert.alert("Error", "Failed to update match status");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={tw`flex-1 bg-black justify-center items-center`}>
                <ActivityIndicator size="large" color="#6366f1" />
            </SafeAreaView>
        );
    }

    if (!match) {
        return (
            <SafeAreaView style={tw`flex-1 bg-black justify-center items-center`}>
                <Text style={tw`text-slate-500 font-bold`}>Match not found or already verified.</Text>
                <TouchableOpacity onPress={handleBack} style={tw`mt-4 px-4 py-2 bg-slate-800 rounded`}>
                    <Text style={tw`text-white`}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const { lostReportId, foundReportId, scores, reasons, status } = match;

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center justify-between px-4 py-4 border-b border-white/5`}>
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={handleBack} style={tw`p-2 bg-slate-900 rounded-full border border-white/10 mr-4`}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={tw`text-white font-bold text-lg`}>Match Resolution</Text>
                </View>
                <View style={tw`w-10 h-10 rounded-full border items-center justify-center ${scores.overall > 0.8 ? 'border-emerald-500 bg-emerald-500/20' : 'border-indigo-500 bg-indigo-500/20'}`}>
                    <Text style={tw`font-extrabold ${scores.overall > 0.8 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                        {(scores.overall * 100).toFixed(0)}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {/* AI Similarity Reasons */}
                <View style={tw`mb-8`}>
                    <Text style={tw`text-slate-400 font-bold uppercase tracking-widest text-xs mb-3`}>
                        AI Confidence Metrics
                    </Text>
                    <View style={tw`flex-row flex-wrap`}>
                        {reasons?.map((reason: string, i: number) => (
                            <View key={i} style={tw`bg-indigo-900/30 border border-indigo-500/30 px-3 py-2 rounded-lg mr-2 mb-2`}>
                                <Text style={tw`text-indigo-300 font-medium text-xs`}>{reason}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Lost Context */}
                <View style={tw`bg-slate-900 border-l-4 border-l-amber-500 p-5 rounded-r-xl mb-4`}>
                    <View style={tw`flex-row items-center mb-2`}>
                        <Ionicons name="search" size={16} color="#f59e0b" />
                        <Text style={tw`text-amber-500 font-bold uppercase text-[10px] tracking-widest ml-2`}>Lost Report Context</Text>
                    </View>
                    <Text style={tw`text-white font-extrabold text-lg mb-1`}>{lostReportId?.itemName || 'Unknown Item'}</Text>
                    <Text style={tw`text-slate-400 text-sm`} numberOfLines={3}>{lostReportId?.description}</Text>
                </View>

                {/* Found Context */}
                <View style={tw`bg-slate-900 border-l-4 border-l-emerald-500 p-5 rounded-r-xl mb-8`}>
                    <View style={tw`flex-row items-center mb-2`}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <Text style={tw`text-emerald-500 font-bold uppercase text-[10px] tracking-widest ml-2`}>Found Report Context</Text>
                    </View>
                    <Text style={tw`text-white font-extrabold text-lg mb-1`}>{foundReportId?.itemName || 'Unknown Item'}</Text>
                    <Text style={tw`text-slate-400 text-sm`} numberOfLines={3}>{foundReportId?.description}</Text>
                </View>

                {/* Status Action Buttons */}
                {status === 'potential' ? (
                    <View style={tw`flex-row gap-3`}>
                        <TouchableOpacity
                            disabled={actionLoading}
                            onPress={() => handleAction('confirmed')}
                            style={tw`flex-1 bg-emerald-600 rounded-xl py-4 items-center justify-center flex-row shadow-lg`}
                        >
                            {actionLoading ? <ActivityIndicator color="white" /> : (
                                <>
                                    <Ionicons name="checkmark" size={20} color="white" />
                                    <Text style={tw`text-white font-bold ml-2`}>Claim Match</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={actionLoading}
                            onPress={() => handleAction('rejected')}
                            style={tw`bg-rose-500/10 border border-rose-500/30 rounded-xl px-6 py-4 items-center justify-center flex-row`}
                        >
                            <Ionicons name="close" size={20} color="#f43f5e" />
                            <Text style={tw`text-rose-400 font-bold ml-2`}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={tw`items-center p-4 rounded-xl border ${status === 'confirmed' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'}`}>
                        <Text style={tw`text-sm font-bold uppercase tracking-widest ${status === 'confirmed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            Status: {status}
                        </Text>
                        {status === 'confirmed' && (
                            <Text style={tw`text-slate-400 text-sm text-center mt-3`}>
                                You have successfully claimed this match. Please check your notifications for the handoff protocol or check the original report on the Web Platform to view external contact info.
                            </Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
