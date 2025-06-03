<template>
    <div class="grid1">
        <div class="flex_between">
            <nav class="flex_between">
                <RouterLink class="flex_center" to="/">{{ $t('home.title') }}</RouterLink>
                <RouterLink class="flex_center" to="/reservations">{{ $t('reservations.title') }}</RouterLink>
                <RouterLink class="flex_center" to="/housekeeping">{{ $t('housekeeping.title') }}</RouterLink>
                <RouterLink class="flex_center" to="/finances">{{ $t('finances.title') }}</RouterLink>
            </nav>
            <nav class="flex_between">
                <auth></auth>
            </nav>
            <LanguageChange/>
        </div>
        <RouterView />
        <footer class="flex_center">
            <RouterLink class="flex_center" to="/about">{{ $t('about.title') }}</RouterLink>
            <p>© 2024 {{ $t('home.hotel') }} "Diploma"</p>
        </footer>
    </div>
</template>

<script setup>
import "@/assets/general.css";
import "@/assets/bubbles.css";
import "@/assets/forms.css";
import { RouterLink, RouterView } from 'vue-router'
import auth from "./components/auth.vue";
import LanguageChange from "@/components/LanguageChange.vue";
import en from './locales/en.json'
import uk from './locales/uk.json'

import {computed, ref} from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isUa = ref(locale.value === 'uk')

const elementLocale = computed(() => (isUa.value ? uk : en))

</script>

<style scoped>
a {
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: rgba(26, 197, 60, 0.8);
  border-radius: 25px 25px 0 25px;
  padding: 10px;
  margin: 5px;
}

</style>

