import { apiRequest } from "./api";


export const PaymentService = {
    simulatePayment: async (paymentData: any) => {
        const res = await apiRequest('/payments/simulate', 'POST', paymentData);
        return res.data;
    }
}