import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import tw from 'twrnc';

export default function AdminUsersScreen() {
    const router = useRouter();
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/' as any);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users?limit=50');
            setUsers(res.data.data.users || []);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch personnel index from server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            setActionLoading(id);
            await api.patch(`/admin/users/${id}/status`, { isActive: !currentStatus });
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
        } catch (error) {
            Alert.alert("Failure", "Could not synchronize state to database.");
        } finally {
            setActionLoading(null);
        }
    };

    const confirmDelete = (id: string, email: string) => {
        Alert.alert(
            "Purge User",
            `Are you sure you want to permanently delete clearance for ${email}?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete Node", style: "destructive", onPress: () => deleteUser(id) }
            ]
        );
    }

    const deleteUser = async (id: string) => {
        try {
            setActionLoading(id);
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            Alert.alert("Success", "User matrix purged.");
        } catch (error) {
            Alert.alert("Failure", "Could not delete user.");
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center px-4 py-4 border-b border-white/5`}>
                <TouchableOpacity onPress={handleBack} style={tw`p-2 bg-slate-900 rounded-full mr-4`}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View>
                    <Text style={tw`text-white font-extrabold text-xl tracking-tight`}>Personnel Roster</Text>
                    <Text style={tw`text-amber-500 text-[10px] font-bold uppercase tracking-widest`}>Admin Override Active</Text>
                </View>
                <TouchableOpacity onPress={fetchUsers} style={tw`ml-auto p-2`}>
                    <Ionicons name="refresh" size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#f59e0b" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                    {users.length === 0 && (
                        <View style={tw`items-center justify-center mt-20`}>
                            <Ionicons name="people-outline" size={48} color="#334155" />
                            <Text style={tw`text-slate-500 font-bold mt-4 tracking-widest text-[11px] uppercase`}>No users found.</Text>
                        </View>
                    )}

                    {users.map((u) => {
                        const isSelf = u._id === currentUser?._id;
                        return (
                            <View key={u._id} style={tw`bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4`}>
                                <View style={tw`flex-row justify-between items-start mb-3 border-b border-white/5 pb-3`}>
                                    <View style={tw`flex-1 mr-4`}>
                                        <Text style={tw`text-white font-bold text-lg leading-tight flex-row items-center`}>
                                            {u.name} {isSelf && <Text style={tw`text-amber-500 text-xs`}>(You)</Text>}
                                        </Text>
                                        <Text style={tw`text-slate-500 font-medium text-xs mt-1`} numberOfLines={1}>
                                            {u.email}
                                        </Text>
                                    </View>
                                    <View style={tw`px-2 py-1 flex-col flex items-end`}>
                                        <Text style={tw`text-[10px] font-extrabold uppercase tracking-widest ${u.role === 'admin' ? 'text-amber-500' : 'text-slate-400'}`}>
                                            {u.role}
                                        </Text>
                                        <Text style={tw`text-[9px] mt-1 font-bold tracking-widest uppercase ${u.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {u.isActive ? "Active" : "Suspended"}
                                        </Text>
                                    </View>
                                </View>

                                {/* Admin Actions */}
                                {!isSelf && (
                                    <View style={tw`flex-row gap-2 mt-2`}>
                                        <TouchableOpacity
                                            disabled={actionLoading === u._id}
                                            onPress={() => toggleStatus(u._id, u.isActive)}
                                            style={tw`flex-1 bg-slate-800 border ${u.isActive ? 'border-amber-500/30' : 'border-emerald-500/30'} rounded-lg py-2.5 items-center justify-center flex-row shadow-sm`}
                                        >
                                            {actionLoading === u._id ? <ActivityIndicator size="small" color="white" /> : (
                                                <>
                                                    <Ionicons name={u.isActive ? "pause-circle" : "play-circle"} size={16} color={u.isActive ? "#f59e0b" : "#10b981"} />
                                                    <Text style={tw`${u.isActive ? 'text-amber-400' : 'text-emerald-400'} font-bold text-[10px] uppercase tracking-wide ml-1.5`}>
                                                        {u.isActive ? 'Suspend' : 'Activate'}
                                                    </Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            disabled={actionLoading === u._id}
                                            onPress={() => confirmDelete(u._id, u.email)}
                                            style={tw`bg-rose-900/20 border border-rose-500/30 rounded-lg px-4 py-2.5 items-center justify-center flex-row`}
                                        >
                                            <Ionicons name="trash" size={16} color="#f43f5e" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
