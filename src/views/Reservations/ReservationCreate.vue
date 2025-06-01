<template>
<!--    <div class="flex_center" v-if="showCreateForm">-->
<!--        <form @submit.prevent="createReservation" id="reservation_form">-->

<!--            <div class="flex_center">-->
<!--                <label for="reservation_start">Start date</label>-->
<!--                <input type="date" id="reservation_start"-->
<!--                       v-model.lazy="form.reservation_start"-->
<!--                       @blur="validateStart(form.reservation_start)"-->
<!--                >-->
<!--            </div>-->
<!--            <span class="error" v-if="error.start">{{ error.start }}</span>-->

<!--            <div class="flex_center">-->
<!--                <label for="reservation_end">End date</label>-->
<!--                <input type="date" id="reservation_end"-->
<!--                       v-model.lazy="form.reservation_end"-->
<!--                       @blur="validateEnd(form.reservation_end)"-->
<!--                >-->
<!--            </div>-->
<!--            <span class="error" v-if="error.end">{{ error.end }}</span>-->

<!--            <div class="flex_center">-->
<!--                <button class="advancedReservationBtn" @click="advancedReservation = !advancedReservation">-->
<!--                    {{advancedReservation ? '-' : '+'}}-->
<!--                </button>-->
<!--            </div>-->
<!--            <div v-if="advancedReservation">-->
<!--                <div class="flex_left">-->
<!--                    <label for="choice">Choose room for me</label>-->
<!--                    <input type="checkbox" id="choice" v-model="form.choice">-->
<!--                </div>-->

<!--                <div class="flex_center">-->
<!--                    <label for="room_id">Room</label>-->
<!--                    <input type="number" id="room_id"-->
<!--                           :disabled="form.choice"-->
<!--                           v-model.lazy="form.room_id"-->
<!--                           @blur="validateRoom(form.room_id)"-->
<!--                    >-->
<!--                </div>-->
<!--                <span class="error" v-if="error.room">{{ error.room }}</span>-->
<!--            </div>-->

<!--            <button type="submit">Create</button>-->
<!--        </form>-->
<!--    </div>-->

<!--    <div class="grid1" v-if="showConfirmForm">-->
<!--        <p>This Room fits your requests!</p>-->
<!--        <p>-->
<!--            Room: <span :style="{color: 'red'}">{{ availableReservation.room_number }} </span>,-->
<!--            Floor: <span :style="{color: 'red'}">{{ availableReservation.floor }}</span>,-->
<!--            Days: <span :style="{color: 'red'}">{{ availableReservation.days_amount }}</span> day(s).-->
<!--        </p>-->
<!--        <p>Price: <span :style="{color: 'red'}">{{ availableReservation.price }} </span>UAH.</p>-->
<!--        <p>(Price can be lowered in payment process if you have discounts on your account)</p>-->
<!--        <div class="flex_center">-->
<!--            <button @click="confirmCreation">Create</button>-->
<!--            <button @click="changeReservation">Change</button>-->
<!--        </div>-->
<!--    </div>-->

    <ReservationForm />
</template>

<script setup>
import {ref} from "vue";
import formValidation from "@/mixins/validator.js";
import {reservationService} from "@/services/reservation.service.js";
import {useRouter} from "vue-router";
import ReservationForm from "@/views/Reservations/ReservationForm.vue";
const { error, resetError, validateRoom, validateStart, validateEnd } = formValidation();
const form = ref({
    room_number: 0,
    reservation_start: '',
    reservation_end: '',
    user_id: localStorage.getItem('credentials'),
    choice: true,
});
const router = useRouter();
const showCreateForm = ref(true),
      showConfirmForm = ref(false),
      advancedReservation = ref(false);
const availableReservation = ref({});
async function createReservation() {
    resetError();
    await validateRoom(form.value.room_number);
    validateStart(form.value.reservation_start);
    validateEnd(form.value.reservation_start, form.value.reservation_end);
    if (!error.value.room && !error.value.start && !error.value.end) {
        const response = await reservationService.createReservation(form.value);
        availableReservation.value = response.data;
        showCreateForm.value = false;
        showConfirmForm.value = true;
    }
}
async function confirmCreation() {

    try {
        const response = await reservationService.confirmCreation(availableReservation.value);
        await router.push({name: 'single-reservation', params: {id: response.data.id}});
    } catch (error) {

    }
}
function changeReservation() {
    showConfirmForm.value = false;
    showCreateForm.value = true;
}
</script>

<style scoped>
.advancedReservationBtn {
    border-radius: 50%;
    height: 50px;
    width: 50px;

    font-weight: bolder;
    font-size: large;

    margin-bottom: 10px;
}
</style>