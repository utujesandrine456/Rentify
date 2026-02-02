import {apiRequest} from "../utils/api";

export const LandlordService = {
  getMyProperties: async () => {
    const res = await apiRequest("/owner/properties", "GET");
    return Array.isArray(res) ? res : [];
  },

  addProperty: async (data: any) => {
    const res = await apiRequest("/owner/properties", "POST", data);
    return res;
  },

  deleteProperty: async (id: string) => {
    await apiRequest(`/owner/properties/${id}`, "DELETE");
  },

  getMyTenants: async () => {
    const res = await apiRequest("/owner/tenants", "GET");
    return Array.isArray(res) ? res : [];
  },

  getPayments: async () => {
    const res = await apiRequest("/owner/payments", "GET");
    return Array.isArray(res) ? res : [];
  },

  searchTenantByPhone: async (phone: string) => {
    const res = await apiRequest(`/owner/search-tenant?phone=${phone}`, "GET");
    return res;
  },
};  