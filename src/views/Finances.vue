<template>
    <div class="right_bubble" id="finances">
        <div class="grid1">
            <h1>Finances</h1>
            <div>
                <p>Info about prices, tariffs and discounts</p>
            </div>
            <div>
                <p>Here is how prices work:</p>
                <ul>
                    <li>
                        <p>Every day on <span class="green">floor 1 costs 500 UAH</span> </p>
                    </li>
                    <li>
                        <p>
                            Each <span class="red">floor</span> is <span class="red">more expensive</span> than last one. 
                            To be exact: <span class="red">25% more, up to 325%</span> (if you want to book on the last floor)
                        </p>
                    </li>
                    <li>
                        <p>
                            But there is also <span class="green">bonus</span> if you stay in hotel for a long time:
                            if reservation is <span class="green">14 days or longer</span>, whole price is <span class="green">down for 10%.</span>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="bubble" v-if="userIsAdmin">
        <form 
        @submit.prevent="validateForm"
        id="pdf_report_form">
            <div class="grid1">
                <input type="date" name="reservation_start"
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
                <a :href="reportLink" target="_blank" rel="noopener noreferrer">report</a>
            </div>
        </form>
        
    </div>
    <div class="left_bubble" id="finances2">
        <div class="grid1">
            <p class="flex_right">We dont have money</p>
            <p class="flex_right">but</p>
            <p class="flex_right">we have spatie/laravel-permissions and Barryvdh aka PDF</p>
            <div class="flex_right">
                <img id="bob" src="http://localhost:8080/storage/bob.png" alt="gangsta bob">
            </div>
            <p class="flex_right">Card For Payment: XXXX-XXXX-XXXX-XXXX</p>
        </div>
    </div>
</template>
<script>
import axiosInstance from '@/api/axios';
import { useUserStore } from '@/stores/userStore';
import { inject, onMounted, ref } from 'vue';
export default {

name: 'Finances',
setup() {
    const reportLink = ref(localStorage.getItem('pdfPath') ? `http://localhost:8080${localStorage.getItem('pdfPath')}` : '');
    const
    error = ref([]),
    form = ref({
        start_date: '',
        end_date: ''
    }),
    userIsAdmin = ref(false),
    userStore = new useUserStore();

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
    onMounted(async () => {
        await userStore.getUser(JSON.parse(localStorage.getItem('credentials')).id);
        userStore.state.user.roles.forEach(role => {
            if (role.name === 'admin') {
                userIsAdmin.value = true;
            }
        })
    });
    return {
        error, form, userIsAdmin, reportLink,
        // messages,
        validateForm, generateReport, validateDate,
    }
}
}
</script>

<style>
#finances {
    display: flex;
    justify-content: flex-start;
    padding: 50px;
}
#finances2 {
    display: flex;
    justify-content: flex-end;
    padding: 50px;
}
#bob {
    width: 300px;
    height: 300px;
    object-fit: cover;
}
</style>