import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { baseURL } from '../api/axios';
import { Alert } from 'react-native';

let socket = null;

export const useSocket = () => {
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            // baseURL includes /api, so we take origin
            const socketURL = baseURL.replace('/api', '');

            if (!socket) {
                socket = io(socketURL, {
                    transports: ['websocket'],
                });

                socket.on('connect', () => {
                    // Send join event with user ID so backend knows who we are
                    socket.emit('join', user._id || user.id);
                });

                socket.on('match_found', (data) => {
                    // We can use a Toast, but Alert is simple for now
                    Alert.alert(
                        "AI Match Detected ⚡",
                        `A high probability match (${Math.round(data.confidenceScore * 100)}%) was found for your report: ${data.reportName}`,
                        [{ text: "View Details" }]
                    );
                });

                socket.on('report_update', (data) => {
                    Alert.alert("Report Update", data.message);
                });
            }
        } else {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        }

        return () => {
            // Don't disconnect on unmount, we want the socket alive across tabs.
            // Disconnect is handled when isAuthenticated becomes false.
        };
    }, [isAuthenticated, user]);

    return socket;
};
