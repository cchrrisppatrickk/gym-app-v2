import apiClient from '../lib/apiClient';

/**
 * Servicio de autenticación para Gym-X Control.
 * Maneja el inicio de sesión y cierre de sesión.
 */

// Siguiendo la regla de espejar DTOs del backend
export interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        role: string;
        // Otros campos que devuelva el backend
    };
}

/**
 * Autentica al usuario con email y contraseña.
 * El token se guarda en el interceptor de la API o se maneja aquí.
 * @param email 
 * @param password 
 */
export async function login(email: string, password: string): Promise<LoginResponse | null> {
    try {
        const { data } = await apiClient.post<LoginResponse>('/auth/login', {
            email,
            password,
        });

        if (data.access_token) {
            localStorage.setItem('gymx_token', data.access_token);
        }

        return data;
    } catch (error) {
        console.error('Error in auth service login:', error);
        throw error;
    }
}

/**
 * Cierra la sesión del usuario eliminando el token.
 */
export function logout(): void {
    localStorage.removeItem('gymx_token');
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}
