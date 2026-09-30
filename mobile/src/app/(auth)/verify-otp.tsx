import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function VerifyOtpScreen() {
    const { email } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const { verifyOtp, isLoading, error } = useAuthStore();
    const router = useRouter();

    const handleVerify = async () => {
        if (!otp) return;
        try {
            await verifyOtp(email as string, otp);
            // If OTP succeeds, auth flow gets satisfied and _layout will redirect to (tabs) automatically
        } catch (e) { }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={tw`flex-1 px-8 justify-center min-h-[100%] pb-12 pt-12`}>
                        <View style={tw`items-start mb-10`}>
                            <TouchableOpacity onPress={() => router.back()} style={tw`w-10 h-10 bg-slate-900 rounded-full items-center justify-center mb-6`}>
                                <Ionicons name="arrow-back" size={20} color="white" />
                            </TouchableOpacity>
                            <Text style={tw`text-3xl font-extrabold text-white tracking-tight`}>Verify Identity</Text>
                            <Text style={tw`text-slate-400 mt-2 text-base font-medium`}>A secure code was sent to {email}.</Text>
                        </View>

                        <View style={tw`bg-slate-900/80 p-6 rounded-3xl border border-white/10`}>
                            {error && (
                                <View style={tw`bg-rose-500/20 p-4 rounded-2xl border border-rose-500/30 mb-6 flex-row items-center`}>
                                    <Ionicons name="warning" size={20} color="#f43f5e" />
                                    <Text style={tw`text-rose-400 ml-2 font-medium flex-1`}>{error}</Text>
                                </View>
                            )}

                            <View style={tw`mb-8`}>
                                <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 ml-1`}>6-Digit Passcode</Text>
                                <View style={tw`bg-black/50 border border-slate-700 rounded-2xl px-4 py-4 flex-row items-center focus:border-indigo-500`}>
                                    <Ionicons name="keypad-outline" size={20} color="#64748b" />
                                    <TextInput
                                        style={tw`flex-1 text-white ml-3 text-lg font-bold tracking-widest`}
                                        placeholder="······"
                                        placeholderTextColor="#475569"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        value={otp}
                                        onChangeText={setOtp}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleVerify}
                                disabled={isLoading || otp.length < 6}
                                style={tw`bg-indigo-600 rounded-2xl py-4 flex-row justify-center items-center shadow-lg shadow-indigo-500/30 ${(!otp || otp.length < 6 || isLoading) ? 'opacity-70' : 'opacity-100'}`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Text style={tw`text-white font-bold text-lg mr-2`}>Confirm Code</Text>
                                        <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
