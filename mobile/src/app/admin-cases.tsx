import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../api/axios';
import tw from 'twrnc';

export default function AdminCasesScreen() {
    const router = useRouter();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/' as any);
        }
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports?limit=50');
            setReports(res.data.data.reports || []);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch active cases from server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            setActionLoading(id);
            await api.patch(`/reports/${id}`, { status });
            Alert.alert("Case Updated", `Asset status shifted to ${status}`);
            setReports(prev => prev.map(r => r._id === id ? { ...r, status } : r));
        } catch (error) {
            Alert.alert("Failure", "Could not synchronize state to database.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center px-4 py-4 border-b border-white/5`}>
                <TouchableOpacity onPress={handleBack} style={tw`p-2 bg-slate-900 rounded-full mr-4`}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View>
                    <Text style={tw`text-white font-extrabold text-xl tracking-tight`}>Case Management</Text>
                    <Text style={tw`text-amber-500 text-[10px] font-bold uppercase tracking-widest`}>Admin Override Active</Text>
                </View>
                <TouchableOpacity onPress={fetchReports} style={tw`ml-auto p-2`}>
                    <Ionicons name="refresh" size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#f59e0b" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                    {reports.length === 0 && (
                        <View style={tw`items-center justify-center mt-20`}>
                            <Ionicons name="briefcase-outline" size={48} color="#334155" />
                            <Text style={tw`text-slate-500 font-bold mt-4 tracking-widest text-[11px] uppercase`}>No active cases.</Text>
                        </View>
                    )}

                    {reports.map((report) => (
                        <View key={report._id} style={tw`bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4`}>
                            <View style={tw`flex-row justify-between items-start mb-3 border-b border-white/5 pb-3`}>
                                <View style={tw`flex-1 mr-4`}>
                                    <Text style={tw`text-white font-bold text-lg leading-tight`}>{report.itemName}</Text>
                                    <Text style={tw`text-slate-500 font-medium text-xs mt-1`} numberOfLines={1}>
                                        Owner: {report.userId?.email || 'Unknown Protocol'}
                                    </Text>
                                </View>
                                <View style={tw`px-2 py-1 rounded bg-black border ${report.type === 'lost' ? 'border-amber-500/30' : 'border-emerald-500/30'}`}>
                                    <Text style={tw`text-[10px] font-extrabold uppercase tracking-widest ${report.type === 'lost' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        {report.type}
                                    </Text>
                                </View>
                            </View>

                            <Text style={tw`text-slate-300 text-sm mb-4 leading-relaxed`} numberOfLines={2}>
                                {report.description}
                            </Text>

                            {/* Admin Actions */}
                            <Text style={tw`text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2`}>Status Controls - Current: {report.status}</Text>
                            <View style={tw`flex-row gap-2`}>
                                {report.status !== 'resolved' && (
                                    <TouchableOpacity
                                        disabled={actionLoading === report._id}
                                        onPress={() => updateStatus(report._id, 'resolved')}
                                        style={tw`flex-1 bg-emerald-600 rounded-lg py-3 items-center justify-center flex-row shadow-sm`}
                                    >
                                        {actionLoading === report._id ? <ActivityIndicator size="small" color="white" /> : (
                                            <>
                                                <Ionicons name="checkmark-circle" size={16} color="white" />
                                                <Text style={tw`text-white font-bold text-xs uppercase tracking-wide ml-1.5`}>Close Case</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}
                                {report.status !== 'removed' && (
                                    <TouchableOpacity
                                        disabled={actionLoading === report._id}
                                        onPress={() => updateStatus(report._id, 'removed')}
                                        style={tw`flex-1 bg-rose-500/10 border border-rose-500/30 rounded-lg py-3 items-center justify-center flex-row`}
                                    >
                                        <Ionicons name="close-circle" size={16} color="#f43f5e" />
                                        <Text style={tw`text-rose-400 font-bold text-xs uppercase tracking-wide ml-1.5`}>Dismiss</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
