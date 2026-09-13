import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback, useEffect } from 'react';
import api from '../../api/axios';
import tw from 'twrnc';

export default function ReportsScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [reports, setReports] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'reports' | 'matches'>('reports');

    const fetchData = async () => {
        try {
            const [paramsRep, paramsMatch] = await Promise.all([
                api.get('/reports'),
                api.get('/matching')
            ]);
            setReports(paramsRep.data.data || []);
            setMatches(paramsMatch.data.data || []);
        } catch (error) {
            console.warn("Failed to fetch telemetry data", error);
        }
    };

    useEffect(() => {
        fetchData().finally(() => setLoading(false));
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().finally(() => setRefreshing(false));
    }, []);

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center justify-between px-6 py-4 bg-black/80 z-10 border-b border-white/5`}>
                <Text style={tw`text-white text-2xl font-extrabold tracking-tight`}>
                    Telemetry Hub
                </Text>
            </View>

            <View style={tw`px-6 pt-4 flex-row`}>
                <TouchableOpacity
                    onPress={() => setTab('reports')}
                    style={tw`flex-1 py-3 border-b-2 ${tab === 'reports' ? 'border-indigo-500' : 'border-transparent'}`}
                >
                    <Text style={tw`text-center font-bold ${tab === 'reports' ? 'text-indigo-400' : 'text-slate-500'}`}>My Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setTab('matches')}
                    style={tw`flex-1 py-3 border-b-2 ${tab === 'matches' ? 'border-rose-500' : 'border-transparent'}`}
                >
                    <Text style={tw`text-center font-bold ${tab === 'matches' ? 'text-rose-400' : 'text-slate-500'}`}>Match Alerts {matches.length > 0 ? `(${matches.length})` : ''}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#6366f1" style={tw`mt-8`} />
                ) : tab === 'reports' ? (
                    reports.length === 0 ? (
                        <View style={tw`items-center justify-center py-12`}>
                            <Ionicons name="document-text-outline" size={48} color="#334155" />
                            <Text style={tw`text-slate-500 mt-4 text-center px-8`}>
                                You have no active telemetry reports initialized.
                            </Text>
                        </View>
                    ) : (
                        reports.map((item) => (
                            <View key={item._id} style={tw`bg-slate-900/60 p-5 rounded-3xl border border-white/10 mb-4`}>
                                <View style={tw`flex-row justify-between items-center mb-3`}>
                                    <View style={tw`flex-row items-center`}>
                                        <Ionicons name={item.type === 'found' ? 'add-circle' : 'search'} size={18} color={item.type === 'found' ? '#34d399' : '#f43f5e'} />
                                        <Text style={tw`text-slate-400 ml-2 font-bold text-xs uppercase tracking-wider`}>
                                            {item.type} Asset
                                        </Text>
                                    </View>
                                    <View style={tw`bg-${item.status === 'open' ? 'indigo' : 'emerald'}-500/20 px-3 py-1 rounded-full`}>
                                        <Text style={tw`text-${item.status === 'open' ? 'indigo' : 'emerald'}-400 text-xs font-bold uppercase`}>{item.status}</Text>
                                    </View>
                                </View>
                                <Text style={tw`text-white font-bold text-lg mb-1`}>{item.itemName}</Text>
                                <Text style={tw`text-slate-400 text-sm mb-3`} numberOfLines={2}>{item.description}</Text>
                                <View style={tw`flex-row items-center mt-2 pt-3 border-t border-white/5`}>
                                    <Ionicons name="location" size={14} color="#94a3b8" />
                                    <Text style={tw`text-slate-400 text-xs ml-1 mr-4`}>{item.locationId?.name || 'Unknown Zone'}</Text>
                                    <Ionicons name="time" size={14} color="#94a3b8" />
                                    <Text style={tw`text-slate-400 text-xs ml-1`}>{item.date}</Text>
                                </View>
                            </View>
                        ))
                    )
                ) : (
                    matches.length === 0 ? (
                        <View style={tw`items-center justify-center py-12`}>
                            <Ionicons name="shield-checkmark-outline" size={48} color="#334155" />
                            <Text style={tw`text-slate-500 mt-4 text-center px-8`}>
                                No AI matches detected for your assets just yet.
                            </Text>
                        </View>
                    ) : (
                        matches.map((match) => (
                            <View key={match._id} style={tw`bg-rose-900/10 p-5 rounded-3xl border border-rose-500/30 mb-4`}>
                                <View style={tw`flex-row justify-between items-center mb-3`}>
                                    <View style={tw`flex-row items-center`}>
                                        <Ionicons name="flash" size={18} color="#fb7185" />
                                        <Text style={tw`text-rose-400 ml-2 font-bold text-xs uppercase tracking-wider`}>
                                            AI Match Detected
                                        </Text>
                                    </View>
                                    <Text style={tw`text-white font-bold text-lg`}>{(match.confidenceScore * 100).toFixed(0)}%</Text>
                                </View>
                                <Text style={tw`text-slate-300 text-sm mb-4 leading-relaxed`}>
                                    The Telemetry Engine found a highly probable match between your report and another active unit.
                                </Text>
                                <TouchableOpacity style={tw`bg-rose-500/20 border border-rose-500/40 py-3 rounded-xl items-center`}>
                                    <Text style={tw`text-rose-400 font-bold`}>View Match Resolution</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
