<template>
    <div id="reservation" class="bubble" v-if="reservation != null">
        <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('reservations.title')" name="reservation">
                <ReservationItem
                    v-if="reservation"
                    :reservation="reservation"
                    :advanced="true"
                />
            </el-tab-pane>
            <el-tab-pane
                :label="$t('reservations.tabs.edit')" name="edit"
                :disabled="reservation.order.is_paid === 1"
            >
                <ReservationForm
                    :reservation="reservation"
                    :update-mode="true"
                />
            </el-tab-pane>
            <el-tab-pane :label="$t('reservations.tabs.discounts')" name="discounts">
                <ReservationOrder
                    :order="reservation?.order"
                    :user-discounts="userDiscounts"
                />
            </el-tab-pane>
            <el-tab-pane :label="$t('reservations.tabs.payment')" name="pay" v-if="reservation.order.is_paid === 0" class="flex_center">
                <el-button
                    :disabled="inPaymentProcess"
                    @click="processPayment"
                >
                    {{ $t('reservations.tabs.pay') }}
                </el-button>
            </el-tab-pane>
            <el-tab-pane v-else :label="$t('reservations.tabs.is_paid')" name="paid" disabled>
            </el-tab-pane>
        </el-tabs>
    </div>

    <div class="bubble" v-else>
        <Loading/>
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
import Loading from "@/components/Loading.vue";
import {useUserStore} from "@/stores/userStore.js";

const
    activeTab = ref('reservation'),
    reservation = ref(null),
    userDiscounts = ref(null),
    inPaymentProcess = ref(false);

const route = useRoute();
const router = useRouter();
const reservationStore = useReservationStore();
const userStore = useUserStore();

const processPayment = async () => {
    inPaymentProcess.value = true;
    try {
        const return_url = window.location.href;
        const response = await reservationService.processPayment(reservation.value.id, {return_url: return_url});
        userStore.state.user = null;

        if (response.data.url) {
            // window.location.href = response.data.url;
        } else {
            router.go(0);
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