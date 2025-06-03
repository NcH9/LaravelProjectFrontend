<template>
    <div class="lang-switcher">
        <el-switch
            v-model="isUa"
            :active-text="'Українська'"
            :inactive-text="'English'"
            @change="toggleLanguage"
            inline-prompt
        />
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'

const { locale } = useI18n()

const isUa = ref(locale.value === 'uk')

const toggleLanguage = () => {
    locale.value = isUa.value ? 'uk' : 'en'
    localStorage.setItem('lang', locale.value)
}

onMounted(()=>{
    if (localStorage.getItem('lang')) {
        locale.value = localStorage.getItem('lang')
        isUa.value = locale.value === 'uk'
    }
})
</script>

<style scoped>
.lang-switcher {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
}
::v-deep(.el-switch__label) {
    color: #000000;
    font-weight: bold;
}
</style>