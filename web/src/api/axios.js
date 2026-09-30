import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Optionally add interceptors for automatic token refresh or error handling here
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // We can handle global 401 Unauthorized errors here
        if (error.response && error.response.status === 401) {
            // redirect to login or clear auth store could go here
        }
        return Promise.reject(error);
    }
);

export default api;
