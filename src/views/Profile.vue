<template>
    <div class="bubble" id="profile">
        <p>
            Your email: {{ user.email }}
        </p>
        <p>
            Your username: {{ user.name }}
        </p>
        <p>
            <div class="grid1">
                Your profile picture:
                <div class="grid1">
                    <img class="flex_center" :src="imageUrl" alt="No Profile picture">
                </div>
            </div>
            <button class="center">change profile picture</button>
        </p>
        <p>
            Your roles: 
            <span v-for="role in user.roles"> {{ role.name + " " }} </span>
        </p>
        <p>
            <button @click="logout">Logout</button>
        </p>
    </div>
    
</template>
<script>
import { useUserStore } from '@/stores/userStore';
import { onBeforeMount, onMounted, ref } from 'vue';

export default {
    name: 'Profile',
    setup() {
        const user = ref(JSON.parse(localStorage.getItem('credentials')));
        const imageUrl = ref(null);
        const userStore = new useUserStore();
        async function loadUser() {
            await userStore.getUser(user.value.id);
            user.value = userStore.state.user;
        }
        function logout() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('credentials');
            window.location.href = '/';
        }
        onBeforeMount( () => {
            user.value = JSON.parse(localStorage.getItem('credentials'));
            // console.log(user.value.email);
        })
        onMounted(async () => {
            await loadUser();
            console.log(user.value.reservations.length);
            imageUrl.value = `http://localhost:8080/storage/images/${user.value.image}`;
        });
        return {
            user, imageUrl,
            loadUser, logout
        }
    }
}
</script>
<style>
#profile img {
    width: 150px;
    /* height: 100px; */
    border-radius: 15px;
    object-fit: cover;
    margin: 10px;
}
</style>