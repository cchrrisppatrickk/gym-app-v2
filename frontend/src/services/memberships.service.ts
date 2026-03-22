import apiClient from '@/lib/apiClient';

export const membershipsService = {
    getAll: async () => {
        const { data } = await apiClient.get('/memberships');
        return data;
    },
    create: async (payload: { userId: number; planId: number; shiftId: number; startDate?: string }) => {
        const { data } = await apiClient.post('/memberships', payload);
        return data;
    },
    payDebt: async (id: number, payload: { amount: number; paymentMethod: string }) => {
        const { data } = await apiClient.post(`/memberships/${id}/pay`, payload);
        return data;
    }
};
