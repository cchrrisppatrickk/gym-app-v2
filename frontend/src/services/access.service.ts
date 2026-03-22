import apiClient from '@/lib/apiClient';

export const accessService = {
    scan: async (userId: number) => {
        const { data } = await apiClient.post('/access/scan', { userId });
        return data;
    }
};
