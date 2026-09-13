import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';
import api from "../api/axios";

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/login", { email, password });

            // Extract token and user from payload safely
            const token = response.data.token || response.data.data?.token;
            const user = response.data.user || response.data.data?.user;

            if (token) await SecureStore.setItemAsync('token', token);

            set({
                user: user,
                isAuthenticated: true,
                isLoading: false
            });
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Login failed"
            });
            throw error;
        }
    },

    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/register", { name, email, password });
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Registration failed"
            });
            throw error;
        }
    },

    verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/verify-otp", { email, otp });

            const token = response.data.token || response.data.data?.token;
            const user = response.data.user || response.data.data?.user;

            if (token) await SecureStore.setItemAsync('token', token);

            set({
                user: user,
                isAuthenticated: true,
                isLoading: false
            });
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Verification failed"
            });
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.warn("Logout error safely ignored", error);
        } finally {
            await SecureStore.deleteItemAsync('token');
            set({ user: null, isAuthenticated: false, error: null });
        }
    },

    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
                set({ user: null, isAuthenticated: false, isLoading: false });
                return;
            }

            const response = await api.get("/auth/me");
            const user = response.data.user || response.data.data?.user;

            set({
                user: user,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            await SecureStore.deleteItemAsync('token');
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    }
}));
