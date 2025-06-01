import { onMounted, reactive } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/api/axios';

export const useReservationStore = defineStore('reservations', () => {
    const state = reactive({
        reservation: {},
        userDiscounts: {},
        reservations: [],
        meta: [],
        links: [],
        error: ''
    })
    async function getReservations(query, fullAdress = '') {
        try {
            const response = fullAdress === ''
                ? await axiosInstance.get(`/reservations${query}`)
                : await axiosInstance.get(fullAdress);

            const meta = response.data.meta;

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
            state.reservation = response.data.reservation;
            state.userDiscounts = response.data.userDiscounts;
        } catch (err) {
            state.error = err.message;
        }
    }


    return { 
        state, 
        getReservations, getOneReservation,
    };
})
