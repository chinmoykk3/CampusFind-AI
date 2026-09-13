import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import api from '../../api/axios';
import tw from 'twrnc';

export default function DashboardScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [feed, setFeed] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeed = async () => {
        try {
            const res = await api.get('/reports/public');
            setFeed(res.data.data);
        } catch (error) {
            console.warn("Failed to fetch feed", error);
        }
    };

    useEffect(() => {
        fetchFeed().finally(() => setLoading(false));
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFeed().finally(() => setRefreshing(false));
    }, []);

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center justify-between px-6 py-4 bg-black/80 z-10 border-b border-white/5`}>
                <View>
                    <Text style={tw`text-slate-400 text-sm font-semibold uppercase tracking-widest`}>
                        Node Active
                    </Text>
                    <Text style={tw`text-white text-xl font-extrabold tracking-tight`}>
                        Telemetry Core
                    </Text>
                </View>
                <TouchableOpacity
                    style={tw`w-10 h-10 rounded-full bg-slate-900 border border-slate-800 items-center justify-center overflow-hidden`}
                    onPress={logout}
                >
                    <Text style={tw`text-indigo-400 font-bold`}>{user?.name ? user.name[0] : 'U'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
                }
            >
                <View style={tw`mb-8 p-6 bg-slate-900/60 rounded-3xl border border-indigo-500/20 shadow-xl shadow-indigo-500/10`}>
                    <View style={tw`w-12 h-12 bg-indigo-600/20 rounded-2xl items-center justify-center mb-4 border border-indigo-500/30`}>
                        <Ionicons name="locate" size={24} color="#818cf8" />
                    </View>
                    <Text style={tw`text-white text-2xl font-bold mb-1`}>
                        Welcome back, {user?.name?.split(' ')[0] || 'Unit'}
                    </Text>
                    <Text style={tw`text-slate-400 text-base leading-relaxed`}>
                        Your mobile telemetry proxy is running optimally. Tracking {feed.length} active physical beacons campus-wide.
                    </Text>
                </View>

                <View style={tw`flex-row justify-between mb-8`}>
                    <TouchableOpacity
                        onPress={() => router.push('/new-report?type=found' as any)}
                        style={tw`bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl flex-1 mr-2 items-center flex-col`}
                    >
                        <View style={tw`w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center mb-3`}>
                            <Ionicons name="add-circle" size={28} color="#34d399" />
                        </View>
                        <Text style={tw`text-white font-bold text-center`}>Found Item</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/new-report?type=lost' as any)}
                        style={tw`bg-rose-500/10 border border-rose-500/20 p-5 rounded-3xl flex-1 ml-2 items-center flex-col`}
                    >
                        <View style={tw`w-12 h-12 rounded-full bg-rose-500/20 items-center justify-center mb-3`}>
                            <Ionicons name="search" size={26} color="#fb7185" />
                        </View>
                        <Text style={tw`text-white font-bold text-center`}>Report Lost</Text>
                    </TouchableOpacity>
                </View>

                <View style={tw`flex-row justify-between items-center mb-4 ml-1`}>
                    <Text style={tw`text-white font-bold text-lg`}>Live Feed</Text>
                    <TouchableOpacity onPress={onRefresh}>
                        <Ionicons name="reload" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#6366f1" style={tw`mt-8`} />
                ) : feed.length === 0 ? (
                    <View style={tw`items-center justify-center py-8`}>
                        <Ionicons name="folder-open-outline" size={48} color="#334155" />
                        <Text style={tw`text-slate-500 mt-4`}>No active reports found</Text>
                    </View>
                ) : (
                    feed.map((item) => (
                        <View key={item._id} style={tw`bg-slate-900/40 p-4 rounded-2xl border border-white/5 mb-4 flex-row items-center`}>
                            <View style={tw`w-14 h-14 bg-slate-800 rounded-xl mr-4 items-center justify-center border border-${item.type === 'found' ? 'emerald' : 'rose'}-500/20`}>
                                <Ionicons name={(item.categoryId?.icon as any) || "cube-outline"} size={24} color={item.type === 'found' ? '#34d399' : '#f43f5e'} />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-white font-bold text-base capitalize`}>{item.itemName}</Text>
                                <Text style={tw`text-slate-400 text-sm mt-1`} numberOfLines={1}>
                                    {item.type === 'found' ? 'Located at' : 'Lost near'} {item.locationId?.name || "Unknown"}
                                </Text>
                            </View>
                            <View style={tw`w-2 h-2 rounded-full ${item.type === 'found' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
