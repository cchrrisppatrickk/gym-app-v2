import apiClient from '@/lib/apiClient';

export const membersService = {
    registerNewMember: async (data: {
        firstName: string;
        lastName: string;
        dni: string;
        email: string;
        phone?: string;
        planId: number;
        shiftId: number;
        paymentAmount: number;
        paymentMethod: string;
    }) => {
        const response = await apiClient.post('/memberships', data);
        return response.data;
    }
};
