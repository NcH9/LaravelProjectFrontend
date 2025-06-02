import axiosInstance from "@/api/axios.js";

export const reservationService = {
    async checkIfPossibleToReserve(data) {
        return await axiosInstance.post('/reservations/confirm', data);
    },

    async createReservation(data) {
        return await axiosInstance.post('/reservations', data);
    },

    async checkIfPossibleToUpdate(reservation, data) {
        return await axiosInstance.post(`/reservations/${reservation}/confirmUpdate`, data);
    },

    async updateReservation(reservation, data) {
        return await axiosInstance.put(`/reservations/${reservation}`, data);
    },

    async processPayment(reservation, data) {
        return await axiosInstance.post(`/orders/${reservation}/process-payment`, data);
    },
}
