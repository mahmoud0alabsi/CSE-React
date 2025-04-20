import { loginUser, registerUser, refreshAccessToken } from './auth';


const handleLogin = async (
    { username, password }
) => {
    try {
        const { access_token, refresh_token } = await loginUser({
            username,
            password,
        });

        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        return {
            success: true,
        }
    } catch (err) {
        return {
            success: false,
            message: err.response?.data || err.message,
        }
    }
};

const handleRegister = async ({ username, email, password }) => {
    try {
        const message = await registerUser({ username, email, password });
        console.log('Registration successful:', message);
        // Optionally redirect to login or show success UI
    } catch (err) {
        console.error('Registration failed:', err.response?.data || err.message);
    }
};

const handleRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        console.warn('No refresh token found');
        return;
    }

    try {
        const { tokens } = await refreshAccessToken(refreshToken);
        console.log('Access token refreshed');
        return tokens.access_token, tokens.refresh_token;
    } catch (err) {
        console.error('Refresh token failed:', err.response?.data || err.message);
        // Optionally: logout user or redirect to login
    }
};


const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // redirect to login or show logout UI
};

export {
    handleLogin,
    handleRegister,
    handleRefreshToken,
    handleLogout,
};
