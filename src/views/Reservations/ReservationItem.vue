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
            <span v-if="!reservation?.order?.isPaid">
                ,
                <span style="color: red;">
                    not paid
                </span>
            </span>
        </p>
    </div>

    <div v-if="advanced">
        <div class="grid1">
            <div class="flex_center">
                <p>
                    Room <span :style="{color: 'red'}">{{ reservation.room.number }} </span>,
                </p>
            </div>
            <div class="flex_center">
                <p>
                    Reserved for {{ totalDays }} days,
                    ({{ formattedStart(reservation.reservation_start) }} - {{ formattedEnd(reservation.reservation_end) }})
                </p>
            </div>
            <div class="flex_center" v-if="reservation.price !== 0">
                <p>
                    Price: {{ reservation.price }} UAH
                </p>
            </div>
            <div class="flex_center">
                <p>
                    <span class="user" v-if="reservation.user_id !== route.meta.uid">
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

</style>