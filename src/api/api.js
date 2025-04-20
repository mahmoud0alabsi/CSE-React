// src/api/axiosInstance.js
import axios from 'axios';
import { handleRefreshToken } from './auth/handlers';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Store a refresh promise to prevent duplicate refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(p => {
        if (error) {
            p.reject(error);
        } else {
            p.resolve(token);
        }
    });

    failedQueue = [];
};

// Request Interceptor — attach token to every request
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');

        // Define routes that don't need auth
        const publicPaths = ['/auth/login', '/auth/register', '/auth/refresh-token'];

        // Only add Authorization header if endpoint is not public
        const isPublic = publicPaths.some(path => config.url.includes(path));

        if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);


// Response Interceptor — handle 401, refresh token and retry
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem('refreshToken')
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { access_token, refresh_token } = await handleRefreshToken(refreshToken);

                localStorage.setItem('accessToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);

                api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
                processQueue(null, access_token);

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Optional: force logout
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
