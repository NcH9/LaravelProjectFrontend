<template>
    <div
        v-if="!isLoading"
        class="profile_bubble"
    >
        <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('auth.your_account_label')" name="userData">
                <el-card class="user-info-card" shadow="hover">
                    <div class="user-info-header">
                        <el-descriptions :title="$t('auth.info')" column="1" border>
                            <el-descriptions-item :label="$t('auth.email')">{{ user.email }}</el-descriptions-item>
                            <el-descriptions-item :label="$t('auth.username')">{{ user.name }}</el-descriptions-item>
                        </el-descriptions>
                    </div>

                    <div class="user-info-roles">
                        <el-descriptions :title="$t('auth.roles.label')" column="1" border>
                            <el-descriptions-item>
                                <template #label>{{ $t('auth.roles.label') }}</template>
                                <el-tag
                                    v-for="role in user.roles"
                                    :key="role.id"
                                    type="success"
                                    class="role-tag"
                                >
                                    {{ $t(`auth.roles.${role.name}`) }}
                                </el-tag>
                            </el-descriptions-item>
                        </el-descriptions>
                    </div>

                    <div class="logout-btn">
                        <el-button type="danger" @click="logout">
                            {{ $t('auth.logout') }}
                        </el-button>
                    </div>
                </el-card>
            </el-tab-pane>
            <el-tab-pane :label="$t('reservations.tabs.your_reservations')" name="userReservations">
                <div v-for="reservation in user.reservations">
                    <ReservationItem
                        :reservation="reservation"
                    />
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('finances.discounts.labels.your_discounts')" name="userDiscounts">
                <DiscountList
                    :discounts="user.discounts"
                    :isAdmin="false"
                />
            </el-tab-pane>
            <el-tab-pane v-if="isAdmin" :label="$t('finances.discounts.labels.seasonal_discounts')" name="allDiscounts">
                <DiscountList
                    :discounts="userStore.state.seasonalDiscounts"
                    :isAdmin="false"
                />
            </el-tab-pane>
        </el-tabs>
        
    </div>
    <div v-else>
        <Loading/>
    </div>
</template>
<script setup>
import { useUserStore } from '@/stores/userStore.js';
import { onMounted, ref } from 'vue';
import {useRoute} from "vue-router";
import Loading from "@/components/Loading.vue";
import DiscountList from "@/views/Finances/Discounts/DiscountList.vue";
import ReservationItem from "@/views/Reservations/ReservationItem.vue";

const userStore = new useUserStore();
const
    activeTab = ref('userData'),
    isLoading = ref(true),
    user = ref(null),
    isAdmin = ref(false);
function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
}

onMounted(async () => {
    isLoading.value = true
    try {
        if (userStore.state.user === null) {
            await userStore.getUser(useRoute().meta.uid);
        }
        user.value = userStore.state.user;
        isAdmin.value = user.value.roles.some(role => role.name === 'admin');
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false;
    }
});
</script>
<style>
.user-info-card {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.user-info-header,
.user-info-roles {
    margin-bottom: 20px;
}

.logout-btn {
    text-align: center;
}
</style>