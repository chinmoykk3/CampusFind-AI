import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) return;
        try {
            await login(email, password);
        } catch (e) { }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={tw`flex-1 px-8 justify-center min-h-[100%] pb-12 pt-20`}>
                        <View style={tw`items-center mb-12`}>
                            <View style={tw`w-20 h-20 bg-indigo-600 rounded-3xl items-center justify-center mb-6 shadow-lg shadow-indigo-500/50`}>
                                <Ionicons name="scan-outline" size={40} color="white" />
                            </View>
                            <Text style={tw`text-4xl font-extrabold text-white text-center tracking-tight`}>CampusFind</Text>
                            <Text style={tw`text-slate-400 mt-2 text-base font-medium`}>Secured Mobile Telemetry</Text>
                        </View>

                        <View style={tw`bg-slate-900/80 p-6 rounded-3xl border border-white/10`}>
                            {error && (
                                <View style={tw`bg-rose-500/20 p-4 rounded-2xl border border-rose-500/30 mb-6 flex-row items-center`}>
                                    <Ionicons name="warning" size={20} color="#f43f5e" />
                                    <Text style={tw`text-rose-400 ml-2 font-medium flex-1`}>{error}</Text>
                                </View>
                            )}

                            <View style={tw`mb-4`}>
                                <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>Email Address</Text>
                                <View style={tw`bg-black/50 border border-slate-700 rounded-2xl px-4 py-4 flex-row items-center focus:border-indigo-500`}>
                                    <Ionicons name="mail-outline" size={20} color="#64748b" />
                                    <TextInput
                                        style={tw`flex-1 text-white ml-3 text-base`}
                                        placeholder="student@campus.edu"
                                        placeholderTextColor="#475569"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </View>

                            <View style={tw`mb-8`}>
                                <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>Password</Text>
                                <View style={tw`bg-black/50 border border-slate-700 rounded-2xl px-4 py-4 flex-row items-center focus:border-indigo-500`}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                                    <TextInput
                                        style={tw`flex-1 text-white ml-3 text-base`}
                                        placeholder="••••••••"
                                        placeholderTextColor="#475569"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={isLoading || !email || !password}
                                style={tw`bg-indigo-600 rounded-2xl py-4 flex-row justify-center items-center shadow-lg shadow-indigo-500/30 ${(!email || !password || isLoading) ? 'opacity-70' : 'opacity-100'}`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Text style={tw`text-white font-bold text-lg mr-2`}>Authenticate</Text>
                                        <Ionicons name="arrow-forward" size={20} color="white" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={tw`mt-8 flex-row justify-center items-center`}>
                            <Text style={tw`text-slate-500 font-medium`}>New telemetry unit? </Text>
                            <TouchableOpacity>
                                <Text style={tw`text-indigo-400 font-bold ml-1`}>Initialize Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
