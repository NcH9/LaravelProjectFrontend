import axiosInstance from "@/api/axios.js";

export const discountService = {
    async getAll() {
        return await axiosInstance.get('/discounts');
    },
    async createDiscount(data) {
        return await axiosInstance.post('/discounts', data);
    },
    async updateDiscount(discountId, data) {
        return await axiosInstance.put(`/discounts/${discountId}`, data);
    }
}
