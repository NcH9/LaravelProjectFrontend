<template>
    <FinancesReport v-if="isUserAdmin"></FinancesReport>
    <RouterLink
        v-if="isUserAdmin"
        class="discount_link"
        :to="{ name: 'DiscountPage' }"
    >
        Discounts
    </RouterLink>

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

    <div class="left_bubble" id="finances2">
        <div class="grid1">
            <p class="flex_right">We dont have money</p>
            <p class="flex_right">but</p>
            <p class="flex_right">we have spatie/laravel-permissions and Barryvdh aka PDF</p>
            <div class="flex_right">
                <img id="bob" src="http://localhost:8080/storage/bob.png" alt="gangsta bob">
            </div>
        </div>
    </div>
</template>
<script setup>
import { useUserStore } from '@/stores/userStore.js';
import { onMounted, ref } from 'vue';
import {useRoute} from "vue-router";
import FinancesReport from "@/views/Finances/FinancesReport.vue";

const
    isUserAdmin = ref(false),
    userStore = new useUserStore(),
    activeTab = ref('reports');
const route = useRoute();

onMounted(async () => {
    try {
        await userStore.getUser(route.meta.uid);
        isUserAdmin.value = userStore.state.user.roles.some(role => role.name === 'admin');
    } catch (error) {
        console.log(error)
    }
});
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

.discount_link {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    color: rgba(26, 197, 60, 0.8);
    border-radius: 25px;
    padding: 10px;
    margin: 5px;
}
</style>