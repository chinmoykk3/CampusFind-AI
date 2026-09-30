import axios from 'axios';
import Storage from '../utils/storage';
import Constants from 'expo-constants';

import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (Platform.OS === 'web') return 'http://localhost:5000/api';
    const debuggerHost = Constants.expoConfig?.hostUri;
    const resolvedIp = debuggerHost?.split(':')[0] || '192.168.31.236';
    return `http://${resolvedIp}:5000/api`;
};

export const baseURL = getBaseUrl();

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await Storage.getItemAsync('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
