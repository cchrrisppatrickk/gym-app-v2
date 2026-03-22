import apiClient from '@/lib/apiClient';

export const salesService = {
    sellProducts: async (data: { items: { productId: number; quantity: number }[]; paymentMethod: string }) => {
        const response = await apiClient.post('/sales/products', data);
        return response.data;
    },
    sellDayPass: async (data: { buyerName: string; dni?: string; price: number; paymentMethod: string }) => {
        const response = await apiClient.post('/sales/day-pass', data);
        return response.data;
    }
};
