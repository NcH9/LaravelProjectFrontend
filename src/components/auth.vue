<template>
    <RouterLink v-if="isLoggedIn" :to="{name: 'profile'}">Profile</RouterLink>
    <div v-if="!isLoggedIn" class="flex_center">
        <RouterLink :to="{name: 'register'}">Register</RouterLink>
        <RouterLink :to="{name: 'login'}">Login</RouterLink>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const isLoggedIn = ref(false);
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        isLoggedIn.value = true;
    } else {
        console.log('No token found');
    }
}


onMounted(async () => {
    checkAuth();
    const userStore = new useUserStore();
    if (localStorage.getItem('credentials')) {
        const savedUserId = JSON.parse(localStorage.getItem('credentials')).id;
        await userStore.getUser(savedUserId);
    }
});
</script>