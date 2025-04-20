import api from '../api';

export const registerUser = async ({ username, email, password }) => {
    const response = await api.post('/auth/register', {
        username,
        email,
        password,
    });
    return response.data;
};

export const loginUser = async ({ username, password }) => {
    const response = await api.post('/auth/login', {
        username,
        password,
    });
    return response.data; // { access_token, refresh_token }
};

export const refreshAccessToken = async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', {
        refresh_token: refreshToken,
    });
    return response.data;
};
