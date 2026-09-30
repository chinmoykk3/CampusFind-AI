import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Animated, ImageBackground, StatusBar } from 'react-native';
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

    // Animations for a friendly, smooth entrance
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handleLogin = async () => {
        if (!email || !password) return;
        try {
            await login(email, password);
        } catch (e) { }
    };

    const getLogo = () => (
        <View style={tw`w-22 h-22 bg-white rounded-[32px] items-center justify-center shadow-2xl shadow-purple-500/30 overflow-hidden relative border border-white/50`}>
            {/* The 3D-ish drop pin base */}
            <View style={tw`w-14 h-16 items-center`}>
                <Ionicons name="location" size={56} color="#7C3AED" style={tw`-mt-1 shadow-sm`} />
                {/* The graduation cap inside */}
                <Ionicons name="school" size={22} color="#ffffff" style={tw`absolute top-2`} />
            </View>
        </View>
    );

    return (
        <ImageBackground
            source={require('../../../assets/campus_bg.png')}
            style={tw`flex-1 bg-sky-200`}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            {/* Extremely light dim just to ensure white readable */}
            <View style={tw`absolute inset-0 bg-black/10`} />

            <SafeAreaView style={tw`flex-1`}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={tw`flex-1`}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                        {/* Interactive Absolute Elements representing doodles */}
                        <View style={tw`absolute top-14 left-6 -rotate-12`}>
                            <Text style={tw`text-white/90 text-sm font-bold shadow-md shadow-black/20`}>Same{"\n"}Campus{"\n"}Same{"\n"}Community</Text>
                        </View>
                        <View style={tw`absolute top-14 right-6 rotate-12 items-center`}>
                            <Text style={tw`text-white/90 text-[13px] font-bold text-center shadow-md shadow-black/20 leading-tight`}>Good{"\n"}Students{"\n"}Find Things{"\n"}Together ♡</Text>
                        </View>

                        <Animated.View style={[tw`flex-1 px-4 justify-center min-h-[100%] pb-10 pt-16`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                            {/* Ultra Sleek Web-Style Header */}
                            <View style={tw`items-center mb-6`}>
                                {/* Little sparkle doodles */}
                                <Text style={tw`absolute top-2 left-[25%] text-white text-lg font-bold -rotate-45`}>|</Text>
                                <Text style={tw`absolute top-8 right-[25%] text-white text-lg font-bold rotate-45`}>/</Text>

                                <View style={tw`mb-3`}>{getLogo()}</View>

                                <View style={tw`flex-row items-center justify-center`}>
                                    <Text style={tw`text-[34px] font-black text-white tracking-tight`}>Campus</Text>
                                    <Text style={tw`text-[34px] font-black text-purple-300 tracking-tight`}>Find</Text>
                                </View>
                                <Text style={tw`text-white/95 text-xs font-bold tracking-widest uppercase mt-1 drop-shadow-md`}>Connect. Recover. Return.</Text>
                            </View>

                            {/* Crisp Glassmorphic Authentication Card */}
                            <View style={tw`bg-white/90 p-6 rounded-[32px] shadow-2xl shadow-indigo-900/20 overflow-hidden`}>

                                <View style={tw`mb-5`}>
                                    <View style={tw`flex-row relative`}>
                                        <Text style={tw`text-slate-800 text-2xl font-black tracking-tight`}>Student </Text>
                                        <Text style={tw`text-indigo-600 text-2xl font-black tracking-tight`}>Login</Text>
                                        <Ionicons name="paper-plane-outline" size={28} color="#8b5cf6" style={tw`absolute right-0 top-0 -rotate-12`} />
                                    </View>
                                    <Text style={tw`text-slate-500 font-medium text-sm mt-1.5`}>Sign in to your CampusFind account</Text>
                                </View>

                                {error && (
                                    <View style={tw`bg-red-50 p-3 rounded-xl border border-red-200 mb-4 flex-row items-center`}>
                                        <Ionicons name="warning" size={16} color="#ef4444" />
                                        <Text style={tw`text-red-600 ml-2 font-medium flex-1 text-xs`}>{error}</Text>
                                    </View>
                                )}

                                {/* Inputs */}
                                <View style={tw`bg-white/95 border border-slate-100/50 rounded-2xl px-3 py-2.5 mb-3 flex-row items-center shadow-[0_4px_12px_rgba(0,0,0,0.02)]`}>
                                    <View style={tw`w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center mr-3`}>
                                        <Ionicons name="mail" size={20} color="#6366f1" />
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-slate-400 text-[9px] font-black uppercase tracking-widest`}>University Email</Text>
                                        <TextInput
                                            style={tw`text-slate-700 text-sm font-bold pt-1 pb-0`}
                                            placeholder="student@campus.edu"
                                            placeholderTextColor="#94a3b8"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={email}
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                </View>

                                <View style={tw`bg-white/95 border border-slate-100/50 rounded-2xl px-3 py-2.5 flex-row items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.02)]`}>
                                    <View style={tw`flex-row items-center flex-1`}>
                                        <View style={tw`w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center mr-3`}>
                                            <Ionicons name="lock-closed" size={20} color="#6366f1" />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`text-slate-400 text-[9px] font-black uppercase tracking-widest`}>Password</Text>
                                            <TextInput
                                                style={tw`text-slate-700 text-sm font-bold pt-1 pb-0`}
                                                placeholder="••••••••"
                                                placeholderTextColor="#94a3b8"
                                                secureTextEntry
                                                value={password}
                                                onChangeText={setPassword}
                                            />
                                        </View>
                                    </View>
                                    <Ionicons name="eye-off-outline" size={22} color="#94a3b8" style={tw`px-2`} />
                                </View>

                                {/* Remember & Forgot Password */}
                                <View style={tw`flex-row justify-between items-center my-4 ml-1 pr-1`}>
                                    <View style={tw`flex-row items-center`}>
                                        <View style={tw`w-5 h-5 bg-indigo-600 rounded mr-2 items-center justify-center`}>
                                            <Ionicons name="checkmark" size={16} color="white" />
                                        </View>
                                        <Text style={tw`text-slate-800 font-bold text-sm tracking-tight`}>Remember me</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <Text style={tw`text-indigo-600 font-bold text-sm`}>Forgot password?</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={handleLogin}
                                    disabled={isLoading || !email || !password}
                                    style={tw`bg-[#616BFA] rounded-full py-3 mt-1 flex-row justify-between items-center px-2 pl-4 shadow-lg shadow-[#616BFA]/40 ${(!email || !password || isLoading) ? 'opacity-60' : 'opacity-100'}`}
                                >
                                    <View style={tw`w-8`} />{/* Spacer to center text */}
                                    <View style={tw`flex-row items-center justify-center`}>
                                        {isLoading ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <Text style={tw`text-white font-black text-[15px] tracking-wide`}>Sign in securely</Text>
                                        )}
                                    </View>
                                    <View style={tw`w-10 h-10 bg-white/20 rounded-full items-center justify-center`}>
                                        <Ionicons name="arrow-forward" size={18} color="white" />
                                    </View>
                                </TouchableOpacity>

                                <View style={tw`flex-row items-center justify-center my-5`}>
                                    <View style={tw`h-[1px] bg-slate-200 w-12`} />
                                    <Text style={tw`text-slate-400 font-bold text-[10px] mx-3 uppercase tracking-widest`}>OR</Text>
                                    <View style={tw`h-[1px] bg-slate-200 w-12`} />
                                </View>

                                <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={tw`border border-indigo-700/20 bg-indigo-50/50 rounded-full py-4 flex-row items-center justify-center mb-1`}>
                                    <Ionicons name="person-add-outline" size={18} color="#4f46e5" style={tw`mr-2`} />
                                    <Text style={tw`text-indigo-800 font-black text-[14px]`}>Create Student Account</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Bottom Ambient Features */}
                            <View style={tw`flex-row justify-between mt-6 px-1 mb-8`}>
                                <View style={tw`flex-1 mx-1 bg-white/20 rounded-3xl p-2.5 flex-row items-center border border-white/40 shadow-sm overflow-hidden`}>
                                    <View style={tw`w-8 h-8 rounded-full bg-white/30 items-center justify-center mr-2 border border-white/20`}>
                                        <Ionicons name="search" size={16} color="white" />
                                    </View>
                                    <Text style={tw`text-white text-[10px] font-bold leading-tight drop-shadow-md`}>Find{"\n"}Lost Items</Text>
                                </View>
                                <View style={tw`flex-1 mx-1 bg-white/20 rounded-3xl p-2.5 flex-row items-center border border-white/40 shadow-sm overflow-hidden`}>
                                    <View style={tw`w-8 h-8 rounded-full bg-emerald-500/30 items-center justify-center mr-2 border border-emerald-400/30`}>
                                        <Ionicons name="shield-checkmark" size={16} color="white" />
                                    </View>
                                    <Text style={tw`text-white text-[10px] font-bold leading-tight drop-shadow-md`}>Safer{"\n"}Campus</Text>
                                </View>
                                <View style={tw`flex-1 mx-1 bg-white/20 rounded-3xl p-2.5 flex-row items-center border border-white/40 shadow-sm overflow-hidden`}>
                                    <View style={tw`w-8 h-8 rounded-full bg-purple-500/30 items-center justify-center mr-2 border border-purple-400/30`}>
                                        <Ionicons name="people" size={16} color="white" />
                                    </View>
                                    <Text style={tw`text-white text-[10px] font-bold leading-tight drop-shadow-md`}>Stronger{"\n"}Community</Text>
                                </View>
                            </View>

                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}
