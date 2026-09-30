import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center justify-between px-6 py-4 bg-black/80 z-10 border-b border-white/5`}>
                <Text style={tw`text-white text-2xl font-extrabold tracking-tight`}>
                    Personnel Profile
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {/* ID Card Wrapper */}
                <View style={tw`bg-indigo-600 rounded-[35px] p-6 mb-8 shadow-xl shadow-indigo-500/20`}>
                    <View style={tw`flex-row justify-between items-start mb-12`}>
                        <View>
                            <Text style={tw`text-indigo-200 font-bold tracking-widest text-xs uppercase`}>Security Level</Text>
                            <Text style={tw`text-white font-black text-lg uppercase`}>{user?.role || 'Student'} Clearance</Text>
                        </View>
                        <Ionicons name="finger-print" size={36} color="rgba(255,255,255,0.4)" />
                    </View>

                    <Text style={tw`text-white font-extrabold text-3xl mb-1`}>{user?.name || 'Unknown Agent'}</Text>
                    <Text style={tw`text-indigo-200 font-medium text-sm tracking-wide`}>{user?.email || 'N/A'}</Text>

                    <View style={tw`mt-8 pt-6 border-t border-indigo-500/50 flex-row justify-between items-end`}>
                        <View>
                            <Text style={tw`text-indigo-300 text-xs font-bold uppercase tracking-widest`}>Entity ID</Text>
                            <Text style={tw`text-white font-bold text-base tracking-widest font-mono mt-1`}>{user?._id?.substring(0, 12).toUpperCase() || '----------------'}</Text>
                        </View>
                        <Ionicons name="barcode-outline" size={28} color="white" />
                    </View>
                </View>

                {/* Account Actions */}
                <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 ml-1`}>Settings</Text>

                <TouchableOpacity
                    onPress={() => router.push('/notifications' as any)}
                    style={tw`bg-slate-900 border border-slate-800 p-4 rounded-2xl flex-row items-center justify-between mb-8`}
                >
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`w-10 h-10 bg-slate-800 rounded-full items-center justify-center mr-4`}>
                            <Ionicons name="notifications" size={18} color="#94a3b8" />
                        </View>
                        <Text style={tw`text-white font-bold text-base`}>Telemetry Alerts</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#64748b" />
                </TouchableOpacity>

                {user?.role === 'admin' && (
                    <>
                        <Text style={tw`text-amber-500 text-sm font-bold uppercase tracking-wider mb-4 ml-1 flex-row items-center`}>
                            <Ionicons name="shield-checkmark" size={14} /> Security Modules
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/admin-cases' as any)}
                            style={tw`bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex-row items-center justify-between mb-4`}
                        >
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`w-10 h-10 bg-amber-500/20 rounded-full items-center justify-center mr-4`}>
                                    <Ionicons name="briefcase" size={18} color="#f59e0b" />
                                </View>
                                <Text style={tw`text-amber-400 font-bold text-base`}>Case Management</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fbbf24" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/admin-users' as any)}
                            style={tw`bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex-row items-center justify-between mb-4`}
                        >
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`w-10 h-10 bg-amber-500/20 rounded-full items-center justify-center mr-4`}>
                                    <Ionicons name="people" size={18} color="#f59e0b" />
                                </View>
                                <Text style={tw`text-amber-400 font-bold text-base`}>Personnel Roster</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#fbbf24" />
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity
                    onPress={logout}
                    style={tw`bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex-row items-center justify-between mt-6`}
                >
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`w-10 h-10 bg-rose-500/20 rounded-full items-center justify-center mr-4`}>
                            <Ionicons name="log-out" size={20} color="#f43f5e" />
                        </View>
                        <Text style={tw`text-rose-400 font-bold text-base`}>Destroy Session</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
