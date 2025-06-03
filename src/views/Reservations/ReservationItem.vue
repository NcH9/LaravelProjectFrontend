<template>
    <div
        v-if="!advanced"
        class="reservation_bubble"
        @click="goToReservation(reservation.id)"
    >
        <p>
            {{$t('reservations.item.room')}}
            <span style="color: red;">
                {{ reservation.room.number }}
            </span>,
            {{ formattedStart(reservation.reservation_start) }} - {{ formattedEnd(reservation.reservation_end)}}
            <span v-if="showEmail">
                , {{$t('reservations.item.by')}}
                <span class="user">
                    {{ reservation.user.email }}
                </span>
            </span>
            <span
                v-if="!reservation?.order?.is_paid"
                style="color: red;"
            >
                {{$t('reservations.item.not_paid')}}
            </span>
            <span
                v-else
                style="color: green"
            >
                {{$t('reservations.item.paid')}}
            </span>
        </p>
    </div>

    <div v-if="advanced">
        <div class="reservation-summary-card">
            <div class="reservation-row">
                <p>
                    {{$t('reservations.item.room')}} <span class="highlight">{{ reservation.room.number }}</span>
                </p>
            </div>

            <div class="reservation-row">
                <p>
                    {{$t('reservations.item.reserved_for')}} {{ totalDays }},
                    ({{ formattedStart(reservation.reservation_start) }} - {{ formattedEnd(reservation.reservation_end) }})
                </p>
            </div>

            <div class="reservation-row" v-if="reservation.price !== 0">
                <p>
                    {{$t('reservations.item.price')}}: <span class="highlight">{{ reservation.price }}</span>{{$t('reservations.item.uah')}}
                </p>
            </div>

            <div class="reservation-row" v-if="reservation.price !== 0">
                <p>
                    {{$t('reservations.item.price_with_discounts')}}: <span class="highlight">{{ reservation.order.price }}</span>{{$t('reservations.item.uah')}}
                </p>
            </div>

            <div class="reservation-row" v-if="reservation.user_id !== route.meta.uid">
                <p class="user-note">
                    {{$t('reservations.item.by')}} {{ reservation.user.email }}
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
.reservation_bubble {
    display: flex;
    justify-content: center;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.75), rgba(200, 200, 200, 0.1));
    border-radius: 25px 0px 0 25px;
    padding: 10px;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-family: 'Courier New', Courier, monospace;
}
.reservation_bubble:hover {
    cursor: pointer;
    background-color: rgba(214, 233, 215, 0.75);
    border-radius: 25px 0 0 25px;
    transition: 0.5s;
}
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