import apiClient from '@/lib/apiClient';

export const cashRegisterService = {
    getCurrent: async () => {
        try {
            const { data } = await apiClient.get('/cash-register/current');
            return data; // Retorna el objeto de la caja o un string vacío/null si no hay
        } catch (error) {
            return null;
        }
    },
    open: async (openingAmount: number) => {
        const { data } = await apiClient.post('/cash-register/open', { openingAmount });
        return data;
    },
    close: async (closingAmountReal: number) => {
        const { data } = await apiClient.post('/cash-register/close', { closingAmountReal });
        return data;
    }
};
