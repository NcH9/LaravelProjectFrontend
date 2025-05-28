<template>
    <div class="reservation_bubble"
         @click="goToReservation(reservation.id)"
    >
        <p>
            Room
            <span :style="{color: 'red'}">
                {{ reservation.room.number }}
            </span>,
            {{ formattedStart(reservation.reservation_start) }} - {{ formattedEnd(reservation.reservation_end) }},
            <span v-if="showEmail">
                By
                <span class="user">
                    {{ reservation.user.email }}
                </span>
            </span>
        </p>
    </div>
</template>

<script setup>

import router from "@/router/index.js";

const props = defineProps({
        reservation: {
            type: Array,
            required: true
        },
        showEmail: {
            type: Boolean,
            required: false,
            default: false,
        }
    })
function formattedStart($start) {
    const [startYear, startMonth, startDay] = $start.split('-');
    return `${startDay}.${startMonth}.${startYear}`;
}
function formattedEnd($end) {
    const [endYear, endMonth, endDay] = $end.split('-');
    return `${endDay}.${endMonth}.${endYear}`;
}
function goToReservation(id) {
    router.push({name: 'single-reservation', params: {id: id}});
}
</script>

<style scoped>

</style>