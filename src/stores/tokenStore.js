import { onMounted, reactive } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/api/axios';

export const useTokenStore = defineStore('token', () => {
    const state = reactive({
        credentials: {},
        error: ''
    })
    onMounted(() => {
        if (!localStorage.getItem('authToken') && localStorage.getItem('credentials')) {
            localStorage.removeItem('credentials');
        }

    })
    async function getUserWithToken() {
        if (!localStorage.getItem('authToken')) {
            console.log('No token found');

            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await axiosInstance.get('/getuser', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            state.credentials = response.data;
            if (!localStorage.getItem('credentials') && state.credentials && localStorage.getItem('authToken')) {
                localStorage.setItem('credentials', JSON.stringify(state.credentials.user));
            }

        } catch (err) {

            state.error = err.message;
        }
    }
    return { state, getUserWithToken };
})
