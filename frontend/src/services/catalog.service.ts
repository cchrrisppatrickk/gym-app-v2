import apiClient from '@/lib/apiClient';

export const catalogService = {
    getProducts: async () => {
        const { data } = await apiClient.get('/catalog/products');
        return data;
    },
    createProduct: async (productData: { name: string; category: string; price: number; stock: number }) => {
        const { data } = await apiClient.post('/catalog/products', productData);
        return data;
    },
    getPlans: async () => {
        const { data } = await apiClient.get('/catalog/plans');
        return data;
    },
    createPlan: async (planData: { name: string; description?: string; durationDays: number; price: number; allowsFreeze: boolean }) => {
        const { data } = await apiClient.post('/catalog/plans', planData);
        return data;
    }
};
