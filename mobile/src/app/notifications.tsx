import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../api/axios';
import tw from 'twrnc';

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data || []);
        } catch (error) {
            console.warn("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications().finally(() => setLoading(false));
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications().finally(() => setRefreshing(false));
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.warn("Failed to mark notification as read", error);
        }
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/' as any);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center px-4 py-4 border-b border-white/5`}>
                <TouchableOpacity onPress={handleBack} style={tw`p-2 bg-slate-900 rounded-full mr-4`}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-white font-bold text-xl`}>Telemetry Alerts</Text>
            </View>

            <ScrollView
                contentContainerStyle={tw`p-6`}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#6366f1" style={tw`mt-8`} />
                ) : notifications.length === 0 ? (
                    <View style={tw`items-center justify-center py-12`}>
                        <Ionicons name="notifications-off-outline" size={48} color="#334155" />
                        <Text style={tw`text-slate-500 mt-4 text-center`}>No active telemetry alerts.</Text>
                    </View>
                ) : (
                    notifications.map((item) => (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => !item.isRead && markAsRead(item._id)}
                            style={tw`p-5 rounded-2xl mb-4 border ${item.isRead ? 'bg-slate-900 border-white/5' : 'bg-indigo-900/40 border-indigo-500/30'}`}
                        >
                            <View style={tw`flex-row justify-between items-start mb-2`}>
                                <Text style={tw`text-white font-bold uppercase text-xs tracking-wider flex-1`}>{item.title}</Text>
                                {!item.isRead && (
                                    <View style={tw`w-2 h-2 rounded-full bg-indigo-500 ml-2 mt-1`} />
                                )}
                            </View>
                            <Text style={tw`text-slate-400 text-sm leading-relaxed mb-3`}>{item.message}</Text>
                            <Text style={tw`text-slate-600 text-xs font-mono`}>{new Date(item.createdAt).toLocaleString()}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
