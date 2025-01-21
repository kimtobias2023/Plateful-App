import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create the Axios instance with the updated environment variable
const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_NETWORK_BACKEND_URL || "http://localhost:3000",
    timeout: 10000,
    withCredentials: true,
});

// Cache for CSRF Token
let csrfTokenCache: string = ''; // Initialize as an empty string

// Fetch CSRF Token
const fetchCsrfToken = async (): Promise<string> => {
    if (csrfTokenCache) {
        return csrfTokenCache; // Return the cached token if it exists
    }

    try {
        const response = await axiosInstance.get<{ csrfToken: string }>('/login');
        csrfTokenCache = response.data.csrfToken;
        console.log('Fetched CSRF Token:', csrfTokenCache);
        return csrfTokenCache;
    } catch (error: any) {
        console.error('Error fetching CSRF token:', error.message || error);
        throw error;
    }
};

// Set CSRF Token in headers
const setCsrfToken = async (): Promise<void> => {
    try {
        const token = await fetchCsrfToken();
        if (token) {
            axiosInstance.defaults.headers.common['x-csrf-token'] = token;
        } else {
            delete axiosInstance.defaults.headers.common['x-csrf-token'];
        }
    } catch (error: any) {
        console.error('Error setting CSRF token:', error.message || error);
    }
};

// Set Authorization Token in headers
const setAuthToken = (token: string | null, type: 'Bearer' | 'Basic' = 'Bearer'): void => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `${type} ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

// Centralized response handler
const handleResponse = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
    try {
        const response = await promise;
        return response.data;
    } catch (error: any) {
        console.error('Request failed:', error.response?.data || error.message || error);
        throw new Error(error.response?.data?.message || 'An error occurred while processing the request.');
    }
};

// Make a Request with automatic CSRF handling and centralized response handling
const makeRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
    await setCsrfToken();
    return handleResponse(axiosInstance(config));
};

export { axiosInstance, setAuthToken, makeRequest, setCsrfToken, handleResponse };




















