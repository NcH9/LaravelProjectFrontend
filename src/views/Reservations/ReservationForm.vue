

<template>
    <div class="flex_center" v-if="showCreateForm">
        <el-form id="reservation_form">
            <el-form-item class="flex_center" label="Start date">
                <el-date-picker
                    type="date"
                    id="reservation_start"
                    value-format="YYYY-MM-DD"
                    v-model="form.reservation_start"
                    @change="validateStart(form.reservation_start)"
                />
                <span class="error" v-if="error.start">{{ error.start }}</span>
            </el-form-item>
            <el-form-item class="flex_center" label="End date">
                <el-date-picker
                    type="date"
                    id="reservation_end"
                    value-format="YYYY-MM-DD"
                    v-model="form.reservation_end"
                    @change="validateEnd(form.reservation_end)"
                />
                <span class="error" v-if="error.end">{{ error.end }}</span>
            </el-form-item>

            <div class="flex_center">
                <el-button
                    class="advancedReservationBtn"
                    @click="advancedReservation = !advancedReservation"
                >
                    {{advancedReservation ? '-' : '+'}}
                </el-button>
            </div>

            <div v-if="advancedReservation">
                <el-form-item class="flex_left" label="Choose room for me">
                    <el-checkbox id="choice" v-model="form.choice"/>
                </el-form-item>
                <el-form-item class="flex_center" label="Room">
                    <el-input-number
                        type="number"
                        id="room_id"
                        :disabled="form.choice"
                        v-model="form.room_id"
                        @change="validateRoom(form.room_id)"
                    />
                    <span class="error" v-if="error.room">{{ error.room }}</span>
                </el-form-item>
            </div>

            <el-button
                @click="checkIfReservationIsAvailable"
                :disabled="awaitingServerResponse"
            >
                Create
            </el-button>
        </el-form>
    </div>

    <div class="grid1" v-if="showConfirmForm">
        <p>This Room fits your requests!</p>
        <p>
            Room: <span :style="{color: 'red'}">{{ availableReservation.room_number }} </span>,
            Floor: <span :style="{color: 'red'}">{{ availableReservation.floor }}</span>,
            Days: <span :style="{color: 'red'}">{{ availableReservation.days_amount }}</span> day(s).
        </p>
        <p>Price: <span :style="{color: 'red'}">{{ availableReservation.price }} </span>UAH.</p>
        <p>(Price can be lowered in payment process if you have discounts on your account)</p>
        <div class="flex_center">
            <button
                @click="createOrUpdateReservation"
                :disabled="awaitingServerResponse"
            >
                Create
            </button>
            <button
                @click="changeReservation"
                :disabled="awaitingServerResponse"
            >
                Change</button>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";
import formValidation from "@/mixins/validator.js";
import {reservationService} from "@/services/reservation.service.js";
import {useRouter} from "vue-router";

const router = useRouter();
const { error, resetError, validateRoom, validateStart, validateEnd } = formValidation();

// props
const props = defineProps({
    reservation: {
        required: false,
        type: Object,
    },
    updateMode: {
        required: false,
        type: Boolean,
        default: false,
    }
})

// vars
const form = ref({
    room_number: props.reservation.room.number ?? 0,
    reservation_start: props.reservation.reservation_start ?? '',
    reservation_end: props.reservation.reservation_end ?? '',
    user_id: props.reservation.user_id ?? localStorage.getItem('credentials'),
    choice: true,
});
const
    showCreateForm = ref(true),
    showConfirmForm = ref(false),
    advancedReservation = ref(false),
    awaitingServerResponse = ref(false),
    availableReservation = ref({});


// methods
async function checkIfReservationIsAvailable() {
    resetError();
    awaitingServerResponse.value = true;
    try {
        await validate(form.value.room_number, form.value.reservation_start, form.value.reservation_end)
        if (error.value.room || error.value.start || error.value.end) {
            return;
        }

        const response = props.updateMode
            ? await reservationService.checkIfPossibleToUpdate(props.reservation.id, form.value)
            : await reservationService.checkIfPossibleToReserve(form.value);

        availableReservation.value = response.data;
        showCreateForm.value = false;
        showConfirmForm.value = true;

    } catch (error) {
        console.log(error);
    } finally {
        awaitingServerResponse.value = false;
    }
}
async function createOrUpdateReservation() {
    awaitingServerResponse.value = true;
    try {
        const response = props.updateMode
            ? await reservationService.updateReservation(props.reservation.id, availableReservation.value)
            : await reservationService.createReservation(availableReservation.value);

        props.updateMode
            ? await router.push({name: 'single-reservation', params: {id: response.data.id}})
            : router.go(0);
    } catch (error) {
        console.log(error);
    } finally {
        awaitingServerResponse.value = false;
    }
}
async function validate(room, start, end) {
    await validateRoom(room);
    validateStart(start);
    validateEnd(start, end);
}
function changeReservation() {
    showConfirmForm.value = false;
    showCreateForm.value = true;
}
</script>

<style scoped>
.advancedReservationBtn {
    border-radius: 50%;
    height: 50px;
    width: 50px;

    font-weight: bolder;
    font-size: large;

    margin-bottom: 10px;
}
</style>