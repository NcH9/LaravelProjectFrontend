
<template>
    <el-tabs v-if="isAdmin === true" v-model="activeTab" style="width: 100%">
        <el-tab-pane :label="$t('finances.discounts.title')" name="discount">
            <div class="flex_between">
                <span class="discount-name">{{ discount.name }}</span>
                <span class="discount-percent">{{ Number(discount.percent) }}%</span>
            </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('finances.discounts.labels.update_discount')" name="updateDiscount">
            <DiscountForm :discount="discount"/>
        </el-tab-pane>
    </el-tabs>
    <div v-else class="flex_between">
        <span class="discount-name">{{ discount.name }}</span>
        <span class="discount-percent">{{ Number(discount.percent) }}%</span>
    </div>
</template>

<script setup>
import DiscountForm from "@/views/Finances/Discounts/DiscountForm.vue";
import {ref} from "vue";

const props = defineProps({
    discount: {
        required: true,
        type: Object,
    },
    isAdmin: {
        required: false,
        default: false,
        type: Boolean,
    }
})
const activeTab = ref('discount');
</script>

<style scoped>

.discount-name {
    font-weight: 600;
    font-size: 16px;
    color: #333;
}

.discount-percent {
    font-weight: 500;
    font-size: 15px;
    color: #2ecc71;
}
</style>