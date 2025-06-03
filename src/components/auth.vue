<template>
    <RouterLink
        v-if="isLoggedIn"
        :to="{name: 'profile'}"
        class="flex_center"
    >
        {{$t('auth.profile')}}
    </RouterLink>
    <div v-if="!isLoggedIn" class="flex_center">
        <RouterLink :to="{name: 'register'}">{{ $t('auth.register') }}</RouterLink>
        <RouterLink :to="{name: 'login'}">{{ $t('auth.login') }}</RouterLink>
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

<style scoped>
a {
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    color: rgba(26, 197, 60, 0.8);
    border-radius: 25px 25px 0 25px;
    /* background-color: rgba(0, 128, 0, 0.2); */
    padding: 10px;
    margin: 5px;
}
</style>