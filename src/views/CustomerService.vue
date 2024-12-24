<script>
import axiosInstance from '@/api/axios';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';

export default {
    setup() {
        const user = ref(JSON.parse(localStorage.getItem('credentials')));
        const userStore = new useUserStore();
        const wow = ref('');
        const spendings = ref(0);
        const currentReservation = ref(null);
        const orderOnWay = ref(false);

        async function loadUser() {
            await userStore.getUser(user.value.id);
            user.value = userStore.state.user;
            console.log(user.value.reservations.length);
        }
        function findIfNowIsReservation() {
            const today = new Date();

            user.value.reservations.forEach(reservation  => {
                const start = new Date(reservation.reservation_start);
                const end = new Date(reservation.reservation_end);

                if (today > start && today < end) {
                    currentReservation.value = reservation;
                    return;
                }
            });
        }
        async function createOrder() {
            console.log(user.value.id);
            console.log(currentReservation.value.room_id);
            const data = {
                user_id: user.value.id, 
                room_id: currentReservation.value.room_id
            };
            try {
                let response = await axiosInstance.post('/orders', data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
        async function checkOrder() {
            const data = {
                user_id: user.value.id, 
                room_id: currentReservation.value.room_id
            };
            try {
                let response = await axiosInstance.post('/orderSpecific', data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                // console.log(response.data);
                if (response.data) {
                    orderOnWay.value = true;
                }
                // if (response.data) {
                //     orderOnWay.value = true;
                // }
            } catch (error) {
                console.log(error);
            }
        }
        onMounted(async () => {
            await loadUser();
            if (user.value.reservations.length > 0) {
                console.log(user.value.reservations);
                user.value.reservations.forEach(reservation => {
                    spendings.value += parseFloat(reservation.price);
                });
            }
            findIfNowIsReservation();
            await checkOrder();
            if (user.value.reservations.length < 3) {
                document.getElementById('wow').style.color = 'red';
                wow.value = 'You could have some rest with us';
            } else if (user.value.reservations.length < 10) {
                document.getElementById('wow').style.color = 'blue';
                wow.value = 'Wow! You are a loyal customer!';
            } else {
                document.getElementById('wow').style.color = 'green';
                wow.value = 'You know how to live!';
            }
        });
        return {
            user, wow, spendings, currentReservation, orderOnWay,
            loadUser, findIfNowIsReservation, createOrder, checkOrder
        }
    }
}
</script>
<template>
<div class="right_bubble" v-if="user.reservations">
    <p>
        Your id: {{ user.id }}
    </p>
    <p>
        {{ user.reservations.length }} Reservations for all time. <span id="wow">{{ wow }}</span>
    </p>
    <p>
        You've spent: {{ spendings }} UAH with us!
    </p>
</div>

<div class="bubble">
    <div v-if="currentReservation && !orderOnWay">
        <div class="flex_center">
            <button @click="createOrder">Order something</button>
        </div>
    </div>
    <div v-else-if="orderOnWay">
        <div class="flex_center">
            <p>
                You have an order on the way!
            </p>
        </div>
    </div>
</div>
</template>
