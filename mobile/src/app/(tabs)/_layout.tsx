import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(15, 23, 42, 0.95)',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 80,
                    paddingBottom: 25,
                    paddingTop: 10,
                },
                tabBarBackground: () =>
                    Platform.OS === 'ios' ? (
                        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                    ) : null,
                tabBarActiveTintColor: '#818cf8',
                tabBarInactiveTintColor: '#475569',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <Ionicons name="apps" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Telemetry',
                    tabBarIcon: ({ color, size }) => <Ionicons name="pulse" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'ID Card',
                    tabBarIcon: ({ color, size }) => <Ionicons name="card" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
