import apiClient from '@/lib/apiClient';

export const usersService = {
    getUsers: async () => {
        const { data } = await apiClient.get('/users');
        return data;
    },
    createUser: async (userData: any) => {
        const { data } = await apiClient.post('/users', userData);
        return data;
    }
};
