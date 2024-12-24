import { onMounted, reactive } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/api/axios';

export const useReservationStore = defineStore('reservations', () => {
    const state = reactive({
        reservation: {},
        reservations: [],
        meta: [],
        links: [],
        sort: [],
        error: ''
    })
    async function getReservations(query) {
        try {
            const response = await axiosInstance.get(`/reservations${query}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }   
            });
            state.reservations = response.data.data;
            state.meta = response.data.meta;
            state.links = response.data.links;
            state.sort = response.data.sort;
        } catch (err) {

            state.error = err.message;
        }
    }
    async function getOneReservation(id) {
        try {
            const response = await axiosInstance.get(`/reservations/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            state.reservation = response.data;
        } catch (err) {
            state.error = err.message;
        }
    }

    async function confirmReservation(data) {
        try {
            const response = await axiosInstance.post('/reservations/confirm', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            state.reservation = response.data;
        } catch (err) {
            if (err.response.status === 400) {
                state.error = "Sorry, but the room is already booked for the selected dates. Please choose another room or dates.";
            }
        }
    }
    async function createReservation(data) {
        try {
            const response = await axiosInstance.post('/reservations', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            state.reservation = response.data;
        } catch (err) {
            if (err.response.status === 400) {
                state.error = "Sorry, but the room is already booked for the selected dates. Please choose another room or dates.";
            }
        }
    }

    async function confirmReservationUpdate (reservation, data) {
        try {
            const response = await axiosInstance.post(`/reservations/${reservation}/confirmUpdate`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            state.reservation = response.data;
        } catch (err) {
            state.error = "Sorry, but the room is already booked for the selected dates. Please choose another room or dates.";
        }
    }
    async function updateReservation(reservation, data) {
        try {
            const response = await axiosInstance.put(`/reservations/${reservation}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            state.reservation = response.data;
        } catch (err) {
            state.error = "Sorry, but the room is already booked for the selected dates. Please choose another room or dates.";
        }
    }

    return { 
        state, 
        getReservations, getOneReservation, createReservation,
        confirmReservation, confirmReservationUpdate, updateReservation
    };
})
