import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

export default function ScanTagScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/' as any);
        }
    };

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    if (!permission) {
        return <View style={tw`flex-1 bg-black`} />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={tw`flex-1 bg-black justify-center items-center px-8`}>
                <Ionicons name="camera-outline" size={48} color="#64748b" style={tw`mb-4`} />
                <Text style={tw`text-white text-center font-bold text-xl mb-2`}>Camera Access Denied</Text>
                <Text style={tw`text-slate-400 text-center mb-6`}>We need your permission to scan deterministic Smart Tags.</Text>
                <TouchableOpacity onPress={requestPermission} style={tw`bg-indigo-600 px-6 py-3 rounded-xl`}>
                    <Text style={tw`text-white font-bold`}>Grant Permission</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
        setScanned(true);

        // Attempt to extract report ID from web deep link URLs (e.g., http://localhost/report/64abc123)
        // or accept a raw MongoID if the QR code is formatted natively
        const match = data.match(/\/report\/([a-zA-Z0-9]+)/);
        const resolvedId = match ? match[1] : data;

        // If it looks like a 24-char hex Mongo ID (standard for our architecture)
        if (/^[a-fA-F0-9]{24}$/.test(resolvedId)) {
            router.push(`/report/${resolvedId}` as any);
        } else {
            // Unrecognized QR Tag payload
            Alert.alert(
                "Invalid Protocol",
                `The scanned Smart Tag does not contain a valid CampusFind Telemetry trace.\n\nPayload: ${data}`,
                [
                    { text: "Dismiss", onPress: () => setScanned(false) }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-row items-center px-4 py-4 absolute z-10 w-full`}>
                <TouchableOpacity onPress={handleBack} style={tw`p-2 bg-black/60 rounded-full border border-white/10`}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-white font-bold text-lg ml-4 shadow-lg`}>
                    Scan Deterministic Tag
                </Text>
            </View>

            <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />

            <View style={tw`absolute inset-x-0 bottom-12 items-center`}>
                <View style={tw`bg-black/70 px-6 py-3 rounded-full border border-white/20`}>
                    <Text style={tw`text-white font-medium`}>Align QR code within the frame</Text>
                </View>
                {scanned && (
                    <TouchableOpacity onPress={() => setScanned(false)} style={tw`mt-4 bg-indigo-600 px-6 py-3 rounded-full shadow-lg`}>
                        <Text style={tw`text-white font-bold`}>Tap to Scan Again</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}
