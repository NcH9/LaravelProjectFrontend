<template>
    <div class="loading-wrapper">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p class="loading-text">
            {{$t('loading')}}
            <span v-if="text">
                {{ text }}
            </span>
        </p>
    </div>
</template>

<script setup>
import { ElIcon } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

defineProps({
    text: {
        type: String,
        default: '',
    },
})
</script>

<style scoped>
.loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--el-color-primary);
}

.loading-text {
    margin-top: 0.5rem;
    font-size: 1.1rem;
}
</style>