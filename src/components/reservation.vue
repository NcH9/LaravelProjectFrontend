<template>
    <div id="reservation" class="bubble" v-if="reservation != null">
        <div class="grid1">
            <div class="flex_center">
                <p>
                    Room <span :style="{color: 'red'}">{{ reservation.room_id }} </span>,
                </p>
            </div>
            <div class="flex_center">
                <p>
                    Reserved for {{ totalDays }} days, 
                    ({{ formattedStart(reservation.reservation_start) }} - {{ formattedEnd(reservation.reservation_end) }})
                </p>
            </div>
            <div class="flex_center" v-if="reservation.price != 0">
                <p>
                    Price: {{ reservation.price }} UAH
                </p>
            </div>
            <div class="flex_center">
                <p>
                    By <span class="user" v-if="reservation.user.id != currentUser.id">
                        {{ reservation.user.email }}
                    </span>
                    <span class="user" v-else>
                        You
                    </span>
                </p>
            </div>
        </div>
        
        
        <div class="flex_center">
            <button @click="createNewForm = !createNewForm">Want to change?</button>
        </div>

        <div v-if="createNewForm" class="flex_center">
            <form @submit.prevent="validateForm" id="confirmReservationUpdate">
                <div class="flex_center">
                    <label for="room_id">Room:</label>
                    <input type="number" id="room_id"  
                        v-model="form.room_id"
                    />
                </div>
                <span class="error" v-if="error.room">
                    {{ error.room }}
                </span>
                <div class="flex_center">
                    <label for="start">Start:</label>
                    <input type="date" id="start" 
                        v-model="form.reservation_start"    
                    />
                </div>
                <span class="error" v-if="error.start">
                    {{ error.start }}
                </span>
                <div class="flex_center">
                    <label for="end">End:</label>
                    <input type="date" id="end" 
                        v-model="form.reservation_end"
                    />
                </div>
                <span class="error" v-if="error.end">
                    {{ error.end }}
                </span>
                <span class="error" v-if="errors">
                    {{ errors }}
                </span>
                <button type="submit">Calculate</button>
            </form>
            <div class="grid1" v-if="confirmationReservation != null" id="confirmation">
                <div class="flex_center">
                    <p>
                        Room <span :style="{color: 'red'}">{{ confirmationReservation.room_id }} </span>,
                    </p>
                </div>
                <div class="flex_center">
                    <p>
                        Reserved for {{ newTotalDays }} days, 
                        ({{ formattedStart(confirmationReservation.reservation_start) }} - {{ formattedEnd(confirmationReservation.reservation_end) }})
                    </p>
                </div>
                <div class="flex_center" v-if="confirmationReservation.price != 0">
                    <p>
                        Price: {{ confirmationReservation.price }} UAH
                    </p>
                </div>
                <div class="flex_center">
                    <p>
                        Are you sure you want to update this reservation?
                    </p>
                </div>

                <form @submit.prevent="updateReservation" id="updateReservation">
                    <div class="flex_center">
                        <button @click="n">Update</button>
                    </div>
                </form>
                
                <div class="flex_center">
                    <button @click="unsatisfied">No</button>
                </div>
            </div>
        </div>  
    </div>
    
    <div class="bubble" v-else>
        <Loading/>
    </div>
</template>
<script>
import formValidation from '@/mixins/validator';
import { useReservationStore } from '@/stores/reservationStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Loading from "@/components/Loading.vue";

export default {
    components: {Loading},
    setup() {
        const route = useRoute();

        const createNewForm = ref(false);
        const form = ref({
            room_id: 0,
            reservation_start: '',
            reservation_end: '',
        });
        const errors = ref('');
        const confirmationReservation = ref(null);
        const reservationStore = useReservationStore();
        const { error, resetError, validateRoom, validateStart, validateEnd } = formValidation();
        function unsatisfied() {
            confirmationReservation.value = null;
            errors.value = '';
        }
        async function updateReservation() {
            reservationStore.state.error = '';
            errors.value = '';
            reservationStore.state.reservation = null;
            await reservationStore.updateReservation(confirmationReservation.value.id, confirmationReservation.value);
            if (reservationStore.state.error) {
                errors.value = reservationStore.state.error;
            } else {
                location.reload();
            }
        }
        const id = route.params.id;
        const reservation = ref(null);
        const totalDays = ref(0);
        const newTotalDays = ref(0);

        const currentUser = ref(JSON.parse(localStorage.getItem('credentials')));
        function validateForm() {
            resetError();
            validateRoom(form.value.room_id);
            validateStart(form.value.reservation_start);
            validateEnd(form.value.reservation_start, form.value.reservation_end);
            if (!error.value.room && !error.value.start && !error.value.end) {
                confirmReservationUpdate();
            }
        }
        async function confirmReservationUpdate() {
            confirmationReservation.value = null;
            reservationStore.state.error = '';
            errors.value = '';
            reservationStore.state.reservation = null;

            await reservationStore.confirmReservationUpdate(reservation.value.id, form.value);
            if (reservationStore.state.error) {
                confirmationReservation.value = null;
                errors.value = reservationStore.state.error;
            } else {
                confirmationReservation.value = reservationStore.state.reservation;
                newTotalDays.value = countDays(confirmationReservation.value.reservation_start, confirmationReservation.value.reservation_end);
            }
        }
        function formattedStart($start) {
            const [startYear, startMonth, startDay] = $start.split('-');
            return `${startDay}.${startMonth}.${startYear}`;
        }
        function formattedEnd($end) {
            const [endYear, endMonth, endDay] = $end.split('-');
            return `${endDay}.${endMonth}.${endYear}`;
        }
        function countDays(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
            
        }
        onMounted(async () => {
            await useReservationStore().getOneReservation(id);
            reservation.value = useReservationStore().state.reservation;
            form.value.room_id = reservation.value.room_id,
            form.value.reservation_start = reservation.value.reservation_start,
            form.value.reservation_end = reservation.value.reservation_end,
            totalDays.value = countDays(reservation.value.reservation_start, reservation.value.reservation_end);
        });
        return {
            currentUser, reservation, id, 
            totalDays, createNewForm, 
            form, errors, confirmationReservation,
            newTotalDays, error,
            formattedStart, formattedEnd, 
            countDays, confirmReservationUpdate, unsatisfied, 
            updateReservation, resetError, validateRoom, 
            validateStart, validateEnd, validateForm
        }
    }
}
</script>
<style>
#reservation .grid1 .flex_center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
}
#reservation p {
    border-bottom: 1px solid black;
}
</style>