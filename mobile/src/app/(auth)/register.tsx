import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Animated, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isLoading, error } = useAuthStore();
    const router = useRouter();

    // Animations for consistent, smooth entrance
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

    const handleRegister = async () => {
        if (!name || !email || !password) return;
        try {
            await register(name, email, password);
            router.push(`/(auth)/verify-otp?email=${encodeURIComponent(email)}` as any);
        } catch (e) { }
    };

    return (
        <ImageBackground
            source={require('../../../assets/campus_bg.png')}
            style={tw`flex-1`}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={tw`flex-1 bg-slate-900/60`}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={tw`flex-1`}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <Animated.View style={[tw`flex-1 px-7 justify-center min-h-[100%] pb-10 pt-8`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                            {/* Header Section */}
                            <View style={tw`items-start mb-8`}>
                                <TouchableOpacity onPress={() => router.back()} style={tw`w-11 h-11 bg-white/10 rounded-full items-center justify-center mb-6`}>
                                    <Ionicons name="arrow-back" size={24} color="white" />
                                </TouchableOpacity>
                                <Text style={tw`text-4xl font-extrabold text-white tracking-tight shadow-md shadow-black/20`}>Join CampusFind</Text>
                                <Text style={tw`text-sky-100 mt-2 text-base font-medium tracking-wide`}>Create your student account.</Text>
                            </View>

                            {/* Crisp Authentication Card */}
                            <View style={tw`bg-white/95 p-7 rounded-[32px] shadow-xl`}>

                                {error && (
                                    <View style={tw`bg-red-50 p-3 rounded-2xl border border-red-200 mb-5 flex-row items-center`}>
                                        <Ionicons name="warning" size={20} color="#ef4444" />
                                        <Text style={tw`text-red-600 ml-2 font-medium flex-1 text-sm`}>{error}</Text>
                                    </View>
                                )}

                                <View style={tw`mb-4`}>
                                    <Text style={tw`text-slate-500 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1`}>Full Name</Text>
                                    <View style={tw`bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 flex-row items-center focus:border-sky-500 focus:bg-white`}>
                                        <Ionicons name="person" size={20} color="#94a3b8" />
                                        <TextInput
                                            style={tw`flex-1 text-slate-800 ml-3 text-base font-medium`}
                                            placeholder="John Doe"
                                            placeholderTextColor="#94a3b8"
                                            autoCapitalize="words"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>
                                </View>

                                <View style={tw`mb-4`}>
                                    <Text style={tw`text-slate-500 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1`}>University Email</Text>
                                    <View style={tw`bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 flex-row items-center focus:border-sky-500 focus:bg-white`}>
                                        <Ionicons name="school" size={20} color="#94a3b8" />
                                        <TextInput
                                            style={tw`flex-1 text-slate-800 ml-3 text-base font-medium`}
                                            placeholder="student@campus.edu"
                                            placeholderTextColor="#94a3b8"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={email}
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                </View>

                                <View style={tw`mb-7`}>
                                    <Text style={tw`text-slate-500 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1`}>Password</Text>
                                    <View style={tw`bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 flex-row items-center focus:border-sky-500 focus:bg-white`}>
                                        <Ionicons name="lock-closed" size={20} color="#94a3b8" />
                                        <TextInput
                                            style={tw`flex-1 text-slate-800 ml-3 text-base font-medium`}
                                            placeholder="••••••••"
                                            placeholderTextColor="#94a3b8"
                                            secureTextEntry
                                            value={password}
                                            onChangeText={setPassword}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={handleRegister}
                                    disabled={isLoading || !name || !email || !password}
                                    style={tw`bg-sky-600 rounded-2xl py-4 flex-row justify-center items-center shadow-md shadow-sky-600/30 ${(!name || !email || !password || isLoading) ? 'opacity-60' : 'opacity-100'}`}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text style={tw`text-white font-bold text-[17px] mr-2`}>Create Account</Text>
                                            <Ionicons name="arrow-forward" size={20} color="white" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}
