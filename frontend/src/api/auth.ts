import api from '../lib/axios';

export const authApi = {
    // Register Tenant + Admin User
    register: (data: any) => api.post('common/auth/register/', data),

    // Login
    login: (data: any) => api.post('common/auth/login/', data),
};
