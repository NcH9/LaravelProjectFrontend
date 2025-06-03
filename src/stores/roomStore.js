import { reactive } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/api/axios';

export const useRoomStore = defineStore('rooms', () => {
    const state = reactive({
        rooms: null,
        error: ''
    })
    async function getRooms(params = {}) {
        try {
            const response = await axiosInstance.get('/rooms', {params});
            state.rooms = response.data;
        } catch (err) {
            state.error = err.message;
        }
    }

    return { 
        state,
        getRooms,
    };
})
