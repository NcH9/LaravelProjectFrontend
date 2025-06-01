<template>
    <div id="reservation" class="bubble" v-if="reservation != null">
        <el-tabs v-model="activeTab">
            <el-tab-pane label="Reservation" name="reservation">
                <ReservationItem
                    v-if="reservation"
                    :reservation="reservation"
                    :advanced="true"
                />
            </el-tab-pane>
            <el-tab-pane label="Edit" name="edit">
                <ReservationForm
                    :reservation="reservation"
                    :update-mode="true"
                />
            </el-tab-pane>
            <el-tab-pane label="Discounts" name="discounts">
                <ReservationOrder
                    :order="reservation.order"
                    :user-discounts="userDiscounts"
                />
            </el-tab-pane>
            <el-tab-pane label="Pay" name="pay">
                <p>Pay</p>
            </el-tab-pane>
        </el-tabs>
    </div>

    <div class="bubble" v-else>
        <p>Loading...</p>
    </div>
</template>
<script setup>
import { useReservationStore } from '@/stores/reservationStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ReservationItem from "@/views/Reservations/ReservationItem.vue";
import ReservationForm from "@/views/Reservations/ReservationForm.vue";
import ReservationOrder from "@/views/Reservations/ReservationOrder.vue";

const
    activeTab = ref('reservation'),
    reservation = ref(null),
    userDiscounts = ref(null);

const route = useRoute();
const reservationStore = useReservationStore();

onMounted(async () => {
    await reservationStore.getOneReservation(route.params.id);
    reservation.value = reservationStore.state.reservation;
    userDiscounts.value = reservationStore.state.userDiscounts;
});
</script>