
<template>
    <el-tabs v-if="!isLoading" v-model="activeTab">
        <el-tab-pane :label="$t('finances.discounts.labels.your_discounts')" name="userDiscounts">
            <DiscountList
                :discounts="userStore.state.user.discounts"
            />
        </el-tab-pane>
        <el-tab-pane v-if="isUserAdmin" :label="$t('finances.discounts.labels.all_discounts')" name="allDiscounts">
            <DiscountList
                :discounts="allDiscounts"
                :isAdmin="isUserAdmin"
            />
        </el-tab-pane>
        <el-tab-pane v-if="isUserAdmin" :label="$t('finances.discounts.labels.create_discount')" name="createDiscount">
            <DiscountForm />
        </el-tab-pane>
    </el-tabs>
    <div v-else class="bubble">
        <Loading/>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useRoute} from "vue-router";
import DiscountForm from "@/views/Finances/Discounts/DiscountForm.vue";
import DiscountList from "@/views/Finances/Discounts/DiscountList.vue";
import {discountService} from "@/services/discount.service.js";
import Loading from "@/components/Loading.vue";

const
    userStore = useUserStore(),
    route = useRoute();

const
    isUserAdmin = ref(false),
    allDiscounts = ref(null),
    activeTab = ref('userDiscounts'),
    isLoading = ref(true);

onMounted(async ()=>{
    try {
        isLoading.value = true;
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
    } finally {
        isLoading.value = false;
    }
});
</script>

<style scoped>

</style>