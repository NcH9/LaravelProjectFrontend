<template>
    <div v-if="!discounts">
        <span>{{ $t('finances.discounts.no_discounts') }}</span>
    </div>

    <div
        v-if="discounts"
        v-for="discount in discounts"
        class="discount-item"
    >
        <DiscountItem
            style="width: 100%"
            :discount="discount"
            :isAdmin="isAdmin"
        />
    </div>
</template>

<script setup>
import DiscountItem from "@/views/Finances/Discounts/DiscountItem.vue";

const props = defineProps({
    discounts: {
        required: true,
        type: [Object, null],
    },
    isAdmin: {
        required: false,
        default: false,
        type: Boolean
    }
});
</script>

<style scoped>
.discount-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    background-color: #f4f4f5;
    border-radius: 15px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    font-family: 'Segoe UI', sans-serif;
}
</style>