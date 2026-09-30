import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const Storage = {
    getItemAsync: async (key) => {
        if (Platform.OS === 'web') {
            try { return localStorage.getItem(key); } catch (e) { return null; }
        }
        return await SecureStore.getItemAsync(key);
    },
    setItemAsync: async (key, value) => {
        if (Platform.OS === 'web') {
            try { localStorage.setItem(key, value); } catch (e) { }
            return;
        }
        return await SecureStore.setItemAsync(key, value);
    },
    deleteItemAsync: async (key) => {
        if (Platform.OS === 'web') {
            try { localStorage.removeItem(key); } catch (e) { }
            return;
        }
        return await SecureStore.deleteItemAsync(key);
    }
};

export default Storage;
