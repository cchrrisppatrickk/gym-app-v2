import apiClient from '@/lib/apiClient';

export const membershipsService = {
    getAll: async () => {
        const { data } = await apiClient.get('/memberships');
        return data;
    },
    create: async (payload: { userId: number; planId: number; shiftId: number }) => {
        const { data } = await apiClient.post('/memberships', payload);
        return data;
    }
};
