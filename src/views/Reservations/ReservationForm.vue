
<template>
  <div class="flex_left">
    <div class="left_bubble">
      <div class="grid2">
        <div class="grid1">
          <div class="flex_center">
            <button @click="createNewForm = !createNewForm">
              Create new reservation
            </button>
          </div>
<!--          <div class="flex_center" v-show="createNewForm">-->
<!--            <form @submit.prevent="validateReservation" id="reservation_form">-->
<!--              <div class="flex_center">-->
<!--                <label for="room_id">Room</label>-->
<!--                <input type="number" id="room_id"-->
<!--                  :disabled="form.choice"-->
<!--                  v-model.lazy="form.room_id"-->
<!--                  @blur="validateRoom(form.room_id)"-->
<!--                >-->
<!--              </div>-->
<!--              <span class="error" v-if="error.room">{{ error.room }}</span>-->

<!--              <div class="flex_left">-->
<!--                <label for="choice">Choose room for me</label>-->
<!--                <input type="checkbox" id="choice" v-model="form.choice">-->
<!--              </div>-->

<!--              <div class="flex_center">-->
<!--                <label for="reservation_start">Start date</label>-->
<!--                <input type="date" id="reservation_start"-->
<!--                  v-model.lazy="form.reservation_start"-->
<!--                  @blur="validateStart(form.reservation_start)"-->
<!--                >-->
<!--              </div>-->
<!--              <span class="error" v-if="error.start">{{ error.start }}</span>-->

<!--              <div class="flex_center">-->
<!--                <label for="reservation_end">End date</label>-->
<!--                <input type="date" id="reservation_end"-->
<!--                  v-model.lazy="form.reservation_end"-->
<!--                  @blur="validateEnd(form.reservation_end)"-->
<!--                >-->
<!--              </div>-->
<!--              <span class="error" v-if="error.end">{{ error.end }}</span>-->

<!--              <button type="submit">Create</button>-->
<!--            </form>-->
<!--          </div>-->
        </div>

        <div class="grid1" v-if="confirmationReservation" id="confirmation">
          <p>
            Your reservation is confirmed!
          </p>
          <p>
            Room <span :style="{color: 'red'}">{{ confirmationReservation.room_id }} </span>,
            on floor <span :style="{color: 'red'}">{{ confirmationReservation.floor }}</span>,
            for <span :style="{color: 'red'}">{{ confirmationReservation.days_amount }}</span> day(s).
          </p>
          <p>
            <!--                        {{ formattedStart(confirmationReservation.reservation_start) }} - -->
            <!--                        {{ formattedEnd(confirmationReservation.reservation_end) }},-->
          </p>
          <p>
            The price for entire booking is <span :style="{color: 'red'}">{{ confirmationReservation.price }} </span>UAH.
          </p>
          <p>
            Are you satisfied with it?
          </p>
          <button @click="createReservation()">Yes</button>
          <button @click="unsatisfied()">No</button>

        </div>
      </div>
      <span class="error" v-if="errors">{{ errors }}</span>
    </div>
  </div>
</template>

<script setup>
import formValidation from '@/mixins/validator.js';
import { useReservationStore } from '@/stores/reservationStore.js';
import {onMounted, ref, watch} from 'vue';
import {useUserStore} from "@/stores/userStore.js";

const reservationStore = new useReservationStore();
const errors = ref(null);
const userStore = useUserStore();
const createNewForm = ref(false);
const form = ref({
  room_id: '',
  reservation_start: '',
  reservation_end: '',
  user_id: localStorage.getItem('credentials'),
  choice: false,
});
const { error, resetError, validateRoom, validateStart, validateEnd } = formValidation();
const confirmationReservation = ref({});

watch(() => form.value.choice, (newVal) => {
  form.value.room_id = 0;
})
function validateReservation() {
  resetError();
  validateRoom(form.value.room_id);
  validateStart(form.value.reservation_start);
  validateEnd(form.value.reservation_start, form.value.reservation_end);
  if (!error.value.room && !error.value.start && !error.value.end) {
    confirmReservation(form.value);
  }
}
async function confirmReservation() {
  confirmationReservation.value = null;
  reservationStore.state.error = '';
  errors.value = '';
  reservationStore.state.reservation = null;

  await reservationStore.confirmReservation(form.value);
  if (reservationStore.state.error) {
    confirmationReservation.value = null;
    errors.value = reservationStore.state.error;
  } else {
    confirmationReservation.value = reservationStore.state.reservation;
  }
}
async function createReservation() {
  await reservationStore.createReservation(confirmationReservation.value);
  if (reservationStore.state.error) {
    error.value = reservationStore.state;
    console.log(error.value);
  } else {
    createNewForm.value = false;
    confirmationReservation.value = null;
    setNullValues();
    await reservationStore.getReservations(`?page=${currentPage.value}`);
    updateValues();
  }
}
function unsatisfied() {
  confirmationReservation.value = null;
}
onMounted(()=>{
  console.log(userStore.state.message);
  userStore.state.message = 'hello2';
  console.log(userStore.state.message);
})
</script>


<style scoped>

</style>