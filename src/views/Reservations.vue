<template>
    <div class="flex_right">
        <div v-if="reservations.length != 0" class="right_bubble">
            <div class="grid1" v-if="reservations.length >= 10">
                <div class="flex_center">
                    <div class="flex_center">
                        <button @click="prevPage" :disabled="!prevPageUrl">Previous</button>
                    </div>
                    <span>Page {{ currentPage }} of {{ totalPages }}</span>
                    <div class="flex_center">
                        <button @click="nextPage" :disabled="!nextPageUrl">Next</button>
                    </div>
                </div>
                <div class="flex_center">
                    <button @click="sortData('room_id')">Sort by room</button>
                    <button @click="sortData('reservation_start')">Sort by start date</button>
                    <button @click="sortData('reservation_end')">Sort by end date</button>
                </div>
            </div>
            <ul>
                <li v-for="reservation in reservations" :key="reservation.id">
                    <div class="reservation_bubble"
                    @click="goToReservation(reservation.id)">
                        <p>
                            Room <span :style="{color: 'red'}">{{ reservation.room_id }} </span>,
                            {{ formattedStart(reservation.reservation_start) }} - {{ formattedEnd(reservation.reservation_end) }},
                            By <span class="user" v-if="reservation.user.id != currentUser.id">
                                {{ reservation.user.email }}
                            </span>
                            <span class="user" v-else>
                                You
                            </span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <div v-else class="right_bubble">
            <div class="flex_center" v-if="sevenseconds == false">
                <p>
                    You have no reservations yet.
                </p>  
            </div>
            <div class="flex_center" v-else>
                <p>Loading...</p>
            </div>
        </div>
    </div>
    <div class="flex_left">
        <div class="left_bubble">
            <div class="grid2">
                <div class="grid1">
                    <div class="flex_center">
                        <button @click="createNewForm = !createNewForm">
                            Create new reservation
                        </button>
                    </div>
                    <div class="flex_center" v-show="createNewForm">
                        <form @submit.prevent="validateReservation" id="reservation_form">
                            <div class="flex_center">
                                <label for="room_id">Room</label>
                                <input type="number" id="room_id" 
                                    v-model.lazy="form.room_id"
                                    @blur="validateRoom(form.room_id)"
                                >
                            </div>
                            <span class="error" v-if="error.room">{{ error.room }}</span>

                            <div class="flex_left">
                                <label for="choice">Choose room for me</label>
                                <input type="checkbox" :onchange="checkchange" id="choice" v-model="form.choice">
                            </div>

                            <div class="flex_center">
                                <label for="reservation_start">Start date</label>
                                <input type="date" id="reservation_start" 
                                    v-model.lazy="form.reservation_start"
                                    @blur="validateStart(form.reservation_start)"
                                >
                            </div>
                            <span class="error" v-if="error.start">{{ error.start }}</span>
                            
                            <div class="flex_center">
                                <label for="reservation_end">End date</label>
                                <input type="date" id="reservation_end" 
                                    v-model.lazy="form.reservation_end"
                                    @blur="validateEnd(form.reservation_end)"
                                >
                            </div>
                            <span class="error" v-if="error.end">{{ error.end }}</span>
                            
                            <button type="submit">Create</button>
                        </form>
                    </div>
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
                        {{ formattedStart(confirmationReservation.reservation_start) }} - 
                        {{ formattedEnd(confirmationReservation.reservation_end) }},
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
<script>
import formValidation from '@/mixins/validator';
import router from '@/router';
import { useReservationStore } from '@/stores/reservationStore';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';

export default {
name: 'Reservations',
setup() {
    const reservationStore = new useReservationStore();
    const reservations = ref([]);
    const errors = ref(null);
    const sevenseconds = ref(true);

    const createNewForm = ref(false);
    const form = ref({
        room_id: '',
        reservation_start: '',
        reservation_end: '',
        user_id: JSON.parse(localStorage.getItem('credentials')).id,
        choice: false,
    });
    const { error, resetError, validateRoom, validateStart, validateEnd } = formValidation();
    const confirmationReservation = ref();

    const currentUser = ref();

    const currentPage = ref(1);
    const totalPages = ref(1);
    const nextPageUrl = ref(null);
    const prevPageUrl = ref(null);

    const sortBy = ref(null);
    const direction = ref(null);

    function checkchange() {
        if (form.value.choice) {
            form.value.room_id = 0;
            document.getElementById('room_id').disabled = true;
        } else {
            document.getElementById('room_id').disabled = false;
        }
    }
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
            await reservationStore.getReservations(`?page=${currentPage.value}&sort_by=${sortBy.value}&direction=${direction.value}`);
            updateValues();
        }
    }
    function unsatisfied() {
        confirmationReservation.value = null;
    }
    function formattedStart($start) {
        const [startYear, startMonth, startDay] = $start.split('-');
        return `${startDay}.${startMonth}.${startYear}`;
    }
    function formattedEnd($end) {
        const [endYear, endMonth, endDay] = $end.split('-');
        return `${endDay}.${endMonth}.${endYear}`;
    }

    async function prevPage() {
        if (reservationStore.state.links.prev) {
            currentPage.value--;
            setNullValues();
            await reservationStore.getReservations(`?page=${currentPage.value}&sort_by=${sortBy.value}&direction=${direction.value}`);
            updateValues();
        }
    }
    async function nextPage() {
        if (reservationStore.state.links.next) {
            currentPage.value++;
            setNullValues();
            await reservationStore.getReservations(`?page=${currentPage.value}&sort_by=${sortBy.value}&direction=${direction.value}`);
            updateValues();
        }
    }
    async function sortData(field) {
        console.log(field, reservationStore.state.sort.sort_by);
        if (reservationStore.state.sort.sort_by === field) {
            direction.value = direction.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortBy.value = field;
            direction.value = 'asc';
        }
        setNullValues();
        await reservationStore.getReservations(`?page=${currentPage.value}&sort_by=${sortBy.value}&direction=${direction.value}`);
        updateValues();
    }
    function updateValues() {
        reservations.value = reservationStore.state.reservations;
        totalPages.value = reservationStore.state.meta.total_pages;
        nextPageUrl.value = reservationStore.state.links.next;
        prevPageUrl.value = reservationStore.state.links.prev;
    }
    function setNullValues() {
        reservations.value = [];
        nextPageUrl.value = null;
        prevPageUrl.value = null;
    }

    function goToReservation(id) {
        router.push({name: 'single-reservation', params: {id: id}});
    }

    onMounted(async () => {
        await reservationStore.getReservations('');
        currentUser.value = JSON.parse(localStorage.getItem('credentials'));
        updateValues();
        setTimeout(() => {
            sevenseconds.value = false;
        }, 7000);
    });
    return {
        reservations, currentPage, totalPages, sevenseconds,
        nextPageUrl, prevPageUrl, sortBy, 
        direction, currentUser, createNewForm, form,
        error, confirmationReservation, errors,
        formattedStart, formattedEnd, prevPage, 
        nextPage, sortData, updateValues, 
        goToReservation, validateReservation, createReservation,
        resetError, validateRoom, validateStart, 
        validateEnd, checkchange, confirmReservation,
        unsatisfied, 
    }
}
}
</script>
<style>
ul {
    list-style-type: none;
}

</style>