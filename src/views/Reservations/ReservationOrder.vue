

<template>
    <el-card class="discount-card" shadow="hover">
        <template #header>
            <div class="card-header">
                <span>{{ $t('reservations.discounts.title') }}</span>
            </div>
        </template>

        <div v-if="order.discounts?.length">
            <el-row
                v-for="discount in order.discounts"
                :key="discount.id"
                class="discount-item"
                justify="space-between"
                align="middle"
            >
                <el-col :span="16">
                    <el-tag type="info" effect="dark">{{ discount.name }}</el-tag>
                </el-col>
                <el-col :span="8" class="text-right">
                    <el-tag type="success">-{{ discount.percent }}%</el-tag>
                </el-col>
            </el-row>
        </div>

        <div v-else class="empty-state">
            <el-empty :description="$t('reservations.discounts.empty')" />
        </div>
    </el-card>
</template>


<script setup>
const props = defineProps({
    order: {
        required: true,
        type: Object,
    },
    userDiscounts: {
        required: true,
        type: Object,
    }
});

</script>

<style scoped>
.discount-card {
    max-width: 500px;
    margin: 1rem auto;
}

.card-header {
    font-weight: bold;
    font-size: 1.1rem;
    padding-bottom: 0.5rem;
}

.discount-item {
    margin-bottom: 0.5rem;
}

.text-right {
    text-align: right;
}
</style>