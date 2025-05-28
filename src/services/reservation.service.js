import axiosInstance from "@/api/axios.js";

export const reservationService = {
    async createReservation(data) {
        return await axiosInstance.post('/reservations/confirm', data);
    },

    async confirmCreation(data) {
        return await axiosInstance.post('/reservations', data);
    }
}
