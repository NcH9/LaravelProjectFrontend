<template>
    <router-link :to="{name: 'create-reservation'}">Reserve Room</router-link>
    <ReservationList></ReservationList>
</template>
<script setup>
import ReservationList from "@/views/Reservations/ReservationList.vue";

</script>
<style scoped>
a {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>