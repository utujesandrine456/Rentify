import {apiRequest} from './api';

export const TenantService = {
    getAvailableProperties: async () => {
        const res = await apiRequest('/tenant/properties', 'GET');
        return Array.isArray(res) ? res : [];
    },

    getMyRentals: async () => {
        const res = await apiRequest('/tenant/my-rentals', 'GET');
        return Array.isArray(res) ? res : [];
    },

    getPayments: async () => {
        const res = await apiRequest('/tenant/payments', 'GET');
        return Array.isArray(res) ? res : [];
    },

    getNotifications: async () => {
        const res = await apiRequest('/tenant/notifications', 'GET');
        return Array.isArray(res) ? res : [];
    },

    markNotificationAsRead: async (notId: string) => {
        const res = await apiRequest(`/tenant/notifications/${notId}/read`, 'PUT');
        return res;
    },

    updateProfile: async (profileData: any) => {
        const res = await apiRequest('/tenant/profile', 'PUT', profileData);
        return res;
    },

    logout: async () => {
        const res = await apiRequest('/tenant/logout', 'POST');
        return res;
    }
}
