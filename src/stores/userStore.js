import { reactive } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/api/axios';

export const useUserStore = defineStore('users', () => {
  const state = reactive({
    message: 'hello1',
    user: [],
    users: [],
    error: ''
  })
  async function getUsers() {
    try {
      const response = await axiosInstance.get('/users');
      state.users = response.data;
    } catch (err) {
      state.error = err.message;
    }
  }
  async function getUser(id) {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      state.user = response.data;
    } catch (err) {
      state.error = err.message;
    }
  }

  async function getUserDiscounts(id) {

  }
  return { state, getUsers, getUser };
})
