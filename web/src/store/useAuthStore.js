import { create } from "zustand";
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
            set({
                user: response.data.data.user,
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
            set({
                user: response.data.data.user,
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
            console.error("Logout error", error);
        } finally {
            set({ user: null, isAuthenticated: false, error: null });
        }
    },

    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get("/auth/me");
            set({
                user: response.data.data.user,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    }
}));
