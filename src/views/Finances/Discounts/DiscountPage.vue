
<template>
    <el-tabs v-model="activeTab">
        <el-tab-pane label="Your Discounts" name="userDiscounts">
            <DiscountList
                :discounts="userStore.state.userDiscounts"
            />
        </el-tab-pane>
        <el-tab-pane v-if="isUserAdmin" label="All Discounts" name="allDiscounts">
            <DiscountList
                :discounts="allDiscounts"
                :isAdmin="isUserAdmin"
            />
        </el-tab-pane>
        <el-tab-pane v-if="isUserAdmin" label="Create New Discount" name="createDiscount">
            <DiscountForm />
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useRoute} from "vue-router";
import DiscountForm from "@/views/Finances/Discounts/DiscountForm.vue";
import DiscountList from "@/views/Finances/Discounts/DiscountList.vue";
import {discountService} from "@/services/discount.service.js";

const
    userStore = useUserStore(),
    route = useRoute();

const
    isUserAdmin = ref(false),
    allDiscounts = ref(null),
    activeTab = ref('userDiscounts');

onMounted(async ()=>{
    try {
        if (!userStore.state.user) {
            await userStore.getUser(route.meta.uid);
        }
        isUserAdmin.value = userStore.state.user.roles.some(role => role.name === 'admin');

        if (isUserAdmin.value) {
            const response = await discountService.getAll();
            allDiscounts.value = response.data.data;
            console.log(allDiscounts.value)
        }
    } catch (error) {
        console.log(error)
    }
});
</script>

<style scoped>

</style>