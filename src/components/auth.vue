<template>
    <RouterLink v-if="isLoggedIn" :to="{name: 'profile'}">Profile</RouterLink>
    <div v-if="!isLoggedIn" class="flex_center">
        <RouterLink :to="{name: 'register'}">Register</RouterLink>
        <RouterLink :to="{name: 'login'}">Login</RouterLink>
    </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import { useTokenStore } from '@/stores/tokenStore';
import { useUserStore } from '@/stores/userStore';

export default {
    setup() {
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
            await (new useTokenStore()).getUserWithToken();
            const userStore = new useUserStore();
            if (localStorage.getItem('credentials')) {
                const savedUserId = JSON.parse(localStorage.getItem('credentials')).id;
                await userStore.getUser(savedUserId);
            }
        });
        return {
            isLoggedIn,
            checkAuth
        }
    }
}
</script>