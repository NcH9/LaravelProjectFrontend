<template>
    <div class="profile_bubble" id="profile">
        <div class="flex_between">
            <div class="grid1">
                <span>
                    Your email: {{ user.email }}
                </span>
                <span>
                    Your username: {{ user.name }}
                </span>
            </div>
            
            <div class="grid1">
                Your profile picture:
                <div class="grid1" v-if="user.image">
                    <img class="flex_center" :src="imageUrl" alt="No Profile picture">
                </div>
                <div class="grid1" v-else>
                    No profile picture
                </div>
            </div>
        </div>

        <div class="grid1">
            <p>
            Your roles: 
            <span v-for="role in user.roles"> {{ role.name + " " }} </span>
            </p>
            <button class="mg-5">change profile picture</button>

            <button class="mg-5" @click="logout">Logout</button>
        </div>
        
    </div>
    
</template>
<script>
import { useUserStore } from '@/stores/userStore.js';
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
.mg-5 {
    margin: 5px;
}
</style>