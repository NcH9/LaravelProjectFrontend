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
                    :order="reservation?.order"
                    :user-discounts="userDiscounts"
                />
            </el-tab-pane>
            <el-tab-pane label="Pay" name="pay" v-if="reservation.order.is_paid === 0" class="flex_center">
                <el-button
                    :disabled="inPaymentProcess"
                    @click="processPayment"
                >
                    Pay
                </el-button>
            </el-tab-pane>
            <el-tab-pane v-else label="Paid!" name="paid" disabled>
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
import {useRoute, useRouter} from 'vue-router';
import ReservationItem from "@/views/Reservations/ReservationItem.vue";
import ReservationForm from "@/views/Reservations/ReservationForm.vue";
import ReservationOrder from "@/views/Reservations/ReservationOrder.vue";
import {reservationService} from "@/services/reservation.service.js";

const
    activeTab = ref('reservation'),
    reservation = ref(null),
    userDiscounts = ref(null),
    inPaymentProcess = ref(false);

const route = useRoute();
const reservationStore = useReservationStore();

const processPayment = async () => {
    inPaymentProcess.value = true;
    try {
        const return_url = window.location.href;
        const response = await reservationService.processPayment(reservation.value.id, {return_url: return_url});

        if (response.data.url) {
            // window.location.href = response.data.url;
        } else {
            useRouter().go(0);
        }
    } catch (error) {
        console.log(error)
    } finally {
        inPaymentProcess.value = false;
    }
};

onMounted(async () => {
    await reservationStore.getOneReservation(route.params.id);
    reservation.value = reservationStore.state.reservation;
    userDiscounts.value = reservationStore.state.userDiscounts;
});
</script>
<style scoped>
* {
    font-family: 'Segoe UI', sans-serif;
}
</style>