<template>
    <div
        v-if="!advanced"
        class="reservation_bubble"
        @click="goToReservation(reservation.id)"
    >
        <p>
            Room
            <span style="color: red;">
                {{ reservation.room.number }}
            </span>,
            {{ formattedStart(reservation.reservation_start) }} - {{ formattedEnd(reservation.reservation_end)}}
            <span v-if="showEmail">
                , By
                <span class="user">
                    {{ reservation.user.email }}
                </span>
            </span>
            <span
                v-if="!reservation?.order?.is_paid"
                style="color: red;"
            >
                not paid
            </span>
            <span
                v-else
                style="color: green"
            >
                paid
            </span>
        </p>
    </div>

    <div v-if="advanced">
        <div class="reservation-summary-card">
            <div class="reservation-row">
                <p>
                    Room <span class="highlight">{{ reservation.room.number }}</span>
                </p>
            </div>

            <div class="reservation-row">
                <p>
                    Reserved for {{ totalDays }} days,
                    ({{ formattedStart(reservation.reservation_start) }} - {{ formattedEnd(reservation.reservation_end) }})
                </p>
            </div>

            <div class="reservation-row" v-if="reservation.price !== 0">
                <p>
                    Price: <span class="highlight">{{ reservation.price }}</span> UAH
                </p>
            </div>

            <div class="reservation-row">
                <p>
                    <span class="user-note" v-if="reservation.user_id !== route.meta.uid">
                      By {{ reservation.user.email }}
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>

import router from "@/router/index.js";
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute();
const props = defineProps({
        reservation: {
            type: Object,
            required: true
        },
        showEmail: {
            type: Boolean,
            required: false,
            default: false,
        },
        advanced: {
            default: false,
            required: false,
            type: Boolean,
        }
    })
const totalDays = computed(()=>{
    const start = new Date(props.reservation.reservation_start);
    const end = new Date(props.reservation.reservation_end);
    return Math.ceil((Math.abs(end - start)) / (1000 * 60 * 60 * 24));
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
.reservation-summary-card {
    display: grid;
    gap: 1rem;
    padding: 1.5rem;
    border: 1px solid #dde6dc;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-top: 1rem;
}

.reservation-row {
    display: flex;
    justify-content: center;
    align-items: center;
}

.highlight {
    color: #67C23A;
    font-weight: 600;
}

.user-note {
    font-style: italic;
    color: #919990;
}
</style>