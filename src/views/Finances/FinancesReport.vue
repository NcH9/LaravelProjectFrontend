
<template>
    <div class="bubble">
        <form
            @submit.prevent="validateForm"
            id="pdf_report_form"
        >
            <div class="grid1">
                <input type="date"
                       name="reservation_start"
                       v-model="form.start_date"
                >
            </div>
            <div class="grid1">
                <input type="date" name="reservation_end"
                       v-model="form.end_date"
                >
            </div>
            <span class="error" v-if="error.length > 0">something`s wrong i can feel it...</span>
            <button type="submit">Generate</button>
            <div class="flex_center">
            </div>
        </form>
    </div>
</template>
<script setup>
import {ref, watch} from "vue";
import axiosInstance from "@/api/axios.js";

const reportLink = ref(localStorage.getItem('pdfPath') ? `http://localhost:8080${localStorage.getItem('pdfPath')}` : '');
const dateRange = ref([]);
const
    error = ref([]),
    form = ref({
        start_date: '',
        end_date: ''
    });
function validateDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!form.value.start_date) {
        error.value.push('Please select start date');
        return;
    }
    if (!form.value.end_date) {
        error.value.push('Please select start date');
        return;
    }

    const start = new Date(form.value.start_date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(form.value.end_date);
    end.setHours(0, 0, 0, 0);

    if (start > end) {
        error.value.push('Start date should be before the end date')
    }
    if (end > today) {
        error.value.push('End date cannot be in the future')
    }
    if (start > today) {
        error.value.push('Start date cannot be in the future')
    }
}
function validateForm() {
    error.value = [];
    validateDate();
    if (error.value.length === 0) {
        generateReport();
    }
}
async function generateReport() {
    const response = await axiosInstance.post('/reservations/generateReport', form.value, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
}

watch(dateRange, (newVal) => {
    form.start_date = newVal[0];
    form.end_date = newVal[1];
})
</script>
<style scoped>

</style>