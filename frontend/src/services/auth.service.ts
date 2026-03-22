import apiClient from '@/lib/apiClient';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const token = response.data.access_token;
        if (token) {
            localStorage.setItem('gymx_token', token);
        }
        return token;
    },
    logout: () => {
        localStorage.removeItem('gymx_token');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },
    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('gymx_token');
        }
        return null;
    }
};
