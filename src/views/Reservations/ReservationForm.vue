

<template>
    <div class="reservation-form-wrapper" v-if="showCreateForm">
        <el-form id="reservation_form" label-position="top" class="styled-form">
            <el-form-item :label="$t('reservations.form.start_date')">
                <el-date-picker
                    type="date"
                    id="reservation_start"
                    value-format="YYYY-MM-DD"
                    v-model="form.reservation_start"
                    @change="validateStart(form.reservation_start)"
                    style="width: 100%"
                />
                <span class="error" v-if="error.start">{{ error.start }}</span>
            </el-form-item>

            <el-form-item :label="$t('reservations.form.end_date')">
                <el-date-picker
                    type="date"
                    id="reservation_end"
                    value-format="YYYY-MM-DD"
                    v-model="form.reservation_end"
                    @change="validateEnd(form.reservation_end)"
                    style="width: 100%"
                />
                <span class="error" v-if="error.end">{{ error.end }}</span>
            </el-form-item>

            <div class="toggle-section">
                <el-button
                    class="toggle-btn"
                    type="primary"
                    text
                    @click="advancedReservation = !advancedReservation"
                >
                    {{ advancedReservation ? $t('reservations.form.advanced.hide') : $t('reservations.form.advanced.show') }}
                </el-button>
            </div>

            <div v-if="advancedReservation">
                <el-form-item>
                    <el-checkbox id="choice" v-model="form.choice">{{ $t('reservations.form.advanced.auto_assign') }}</el-checkbox>
                </el-form-item>

                <el-form-item :label="$t('reservations.form.advanced.room_number')">
                    <el-input-number
                        id="room_id"
                        :disabled="form.choice"
                        v-model="form.room_id"
                        @change="validateRoom(form.room_id)"
                        style="width: 100%"
                    />
                    <span class="error" v-if="error.room">{{ error.room }}</span>
                </el-form-item>
            </div>

            <div class="submit-section">
                <el-button
                    type="success"
                    @click="checkIfReservationIsAvailable"
                    :disabled="awaitingServerResponse"
                    style="color: black"
                >
                    {{ $t('reservations.form.check_availability') }}
                </el-button>
            </div>
        </el-form>
    </div>

    <div class="grid1" v-if="showConfirmForm">
        <p>{{ $t('reservations.form.available') }}</p>
        <p>
            {{ $t('reservations.form.room') }}: <span :style="{color: 'red'}">{{ availableReservation.room_number }} </span>,
            {{ $t('reservations.form.floor') }}: <span :style="{color: 'red'}">{{ availableReservation.floor }}</span>,
            {{ $t('reservations.form.days') }}: <span :style="{color: 'red'}">{{ availableReservation.days_amount }}</span> {{ $t('reservations.form.days_amount') }}.
        </p>
        <p>{{ $t('reservations.form.price') }}: <span :style="{color: 'red'}">{{ availableReservation.price }} </span>{{ $t('reservations.form.uah') }}.</p>
        <p>{{ $t('reservations.form.discount_message') }}</p>
        <div class="flex_center">
            <button
                @click="createOrUpdateReservation"
                :disabled="awaitingServerResponse"
            >
                {{ props.updateMode ? $t('reservations.form.update') : $t('reservations.form.create') }}
            </button>
            <button
                @click="changeReservation"
                :disabled="awaitingServerResponse"
            >
                {{ $t('reservations.form.change') }}
            </button>
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
    room_number: props.reservation?.room.number ?? 0,
    reservation_start: props.reservation?.reservation_start ?? '',
    reservation_end: props.reservation?.reservation_end ?? '',
    user_id: props.reservation?.user_id ?? localStorage.getItem('credentials'),
    choice: Boolean(!props.reservation?.room.number ?? true),
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
            ? router.go(0)
            : await router.push({name: 'single-reservation', params: {id: response.data.id}});
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
.grid1 {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #ffffff;
    border: 1px solid #d1e7dd;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    font-family: "Segoe UI", sans-serif;
    font-size: 16px;
    color: #333;
}

.grid1 p {
    margin-bottom: 1rem;
    line-height: 1.6;
}

.grid1 span {
    font-weight: 600;
    color: #2e7d32;
}

.grid1 .flex_center {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
}

button {
    margin: 10px;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
    transition: background-color 0.2s ease;
}

.error {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
}

#reservation_form {
    background-color: #ffffff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    font-family: 'Segoe UI', sans-serif;
}

.reservation-form-wrapper {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 12px;
    background: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.styled-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.error {
    color: #f56c6c;
    font-size: 0.875rem;
    margin-top: 0.3rem;
}

.toggle-section,
.submit-section {
    display: flex;
    justify-content: center;
}

.toggle-btn {
    font-weight: bold;
}
</style>