<template>
    <div v-if="!isLoading" class="right_bubble">
        <div v-if="reservations.length !== 0">
            <div class="grid1" v-if="reservations.length >= 10">
                <div class="flex_center">
                    <div class="flex_center">
                        <button @click="prevPage" :disabled="!prevPageUrl">{{ $t('sort.previous') }}</button>
                    </div>
                    <span>Page {{ currentPage }} of {{ totalPages }}</span>
                    <div class="flex_center">
                        <button @click="nextPage" :disabled="!nextPageUrl">{{ $t('sort.next') }}</button>
                    </div>
                    </div>
<!--                    <div class="flex_center">-->
<!--                        <button @click="sortData('room_id')">Sort by room</button>-->
<!--                        <button @click="sortData('reservation_start')">Sort by start date</button>-->
<!--                        <button @click="sortData('reservation_end')">Sort by end date</button>-->
<!--                    </div>-->
                </div>
                <div v-for="reservation in reservations" :key="reservation.id">
                    <ReservationItem
                        :reservation="reservation"
                        :show-email="reservation.user.id !== currentUserId"
                    />
                </div>
            </div>
            <div class="flex_center" v-else>
            <p>
                {{ $t('reservations.no_reservations') }}
            </p>
        </div>
    </div>

    <div v-else class="right_bubble">
        <div class="flex_center">
            <Loading/>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useReservationStore} from "@/stores/reservationStore.js";
import {useRoute} from "vue-router";
import ReservationItem from "@/views/Reservations/ReservationItem.vue";
import Loading from "@/components/Loading.vue";

const isLoading = ref(true);
const
    reservationStore = useReservationStore(),
    route = useRoute();
const
    currentUserId = route.meta.uid ?? null,
    reservations = ref([]),
    currentPage = ref(1),
    totalPages = ref(1),
    nextPageUrl = ref(null),
    prevPageUrl = ref(null);
async function prevPage() {
    if (prevPageUrl.value) {
        isLoading.value = true;
        try {
            await reservationStore.getReservations('', prevPageUrl.value);
            updateValues();
        } catch (error) {
            console.log(error)
        } finally {
            isLoading.value = false;
        }
    }
}
async function nextPage() {
    if (nextPageUrl.value) {
        isLoading.value = true;

        try {
            await reservationStore.getReservations('', nextPageUrl.value);
            updateValues();
        } catch (error) {
            console.log(error)
        } finally {
            isLoading.value = false;
        }
    }
}
async function sortData(field) {

}
function updateValues() {
    reservations.value = reservationStore.state.reservations;
    currentPage.value = reservationStore.state.meta.current_page;
    totalPages.value = reservationStore.state.meta.last_page;

    nextPageUrl.value = reservationStore.state.links.next_page_url;
    prevPageUrl.value = reservationStore.state.links.prev_page_url;
}
onMounted(async () => {
    isLoading.value = true;
    try {
        await reservationStore.getReservations('');
        updateValues();
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false;
    }
});
</script>

<style scoped />