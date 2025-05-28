import { onMounted, reactive } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/api/axios';

export const useReservationStore = defineStore('reservations', () => {
    const state = reactive({
        reservation: {},
        reservations: [],
        meta: [],
        links: [],
        error: ''
    })
    async function getReservations(query, fullAdress = '') {
        try {
            let response;
            if (fullAdress !== '') {
                response = await axiosInstance.get(fullAdress);
            } else {
                response = await axiosInstance.get(`/reservations${query}`);
            }

            const meta = response.data.meta;
            console.log()

            state.reservations = response.data.data;
            state.meta.current_page = meta.current_page;
            state.meta.last_page = meta.last_page;
            state.meta.per_page = meta.per_page;
            state.meta.total = meta.total;
            state.links.prev_page_url = meta.prev_page_url;
            state.links.next_page_url = meta.next_page_url;
        } catch (err) {
            state.error = err.message;
        }
    }
    async function getOneReservation(id) {
        try {
            const response = await axiosInstance.get(`/reservations/${id}`);
            state.reservation = response.data;
        } catch (err) {
            state.error = err.message;
        }
    }

    // async function confirmReservation(data) {
    //     try {
    //         const response = await axiosInstance.post('/reservations/confirm', data);
    //         state.reservation = response.data;
    //     } catch (err) {
    //         if (err.response.status === 400) {
    //             state.error = "Sorry, but the room is already booked for the selected dates. Please choose another room or dates.";
    //         }
    //     }
    // }
    // async function createReservation(data) {
    //     try {
    //         const response = await axiosInstance.post('/reservations', data);
    //         state.reservation = response.data;
    //     } catch (err) {
    //         if (err.response.status === 400) {
    //             state.error = "Sorry, but the room is already booked for the selected dates. Please choose another room or dates.";
    //         }
    //     }
    // }

    async function confirmReservationUpdate (reservation, data) {
        try {
            const response = await axiosInstance.post(`/reservations/${reservation}/confirmUpdate`, data);
            state.reservation = response.data;
        } catch (err) {
            state.error = "Sorry, but the room is already booked for the selected dates. Please choose another room or dates.";
        }
    }
    async function updateReservation(reservation, data) {
        try {
            const response = await axiosInstance.put(`/reservations/${reservation}`, data);
            state.reservation = response.data;
        } catch (err) {
            state.error = "Sorry, but the room is already booked for the selected dates. Please choose another room or dates.";
        }
    }

    return { 
        state, 
        getReservations, getOneReservation,
        confirmReservationUpdate, updateReservation
    };
})
