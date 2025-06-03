<template>
    <div v-if="!isLoading">
        <RouterLink
            v-if="isUserAdmin"
            class="discount_link"
            :to="{ name: 'DiscountPage' }"
        >
            {{$t('finances.discounts.page_link')}}
        </RouterLink>

        <div class="right_bubble" id="finances">
            <div class="grid1">
                <h1>{{ $t('finances.title') }}</h1>
                <div>
                    <p>{{ $t('finances.info_label') }}</p>
                </div>
                <el-tabs v-if="!isLoading" v-model="activeTab">
                    <el-tab-pane :label="$t('finances.room_prices')" name="roomPrices">
                        <div
                            v-for="(floor, index) in roomStore.state.rooms"
                            :key="index"
                            class="floor-container"
                        >
                            <div class="floor-header">
                                <span class="floor-title">{{ $t('housekeeping.floor') }} {{ index }}</span>
                            </div>

                            <div class="floor-prices">
                                <el-tag type="success" size="small" class="price-tag">
                                    {{ floor[0].price }} {{ $t('finances.uah') }} / {{ $t('finances.per_day') }}
                                </el-tag>

                                <el-tag type="warning" size="small" class="price-tag">
                                    {{ floor[0].pricePerWeek }} {{ $t('finances.uah') }} / {{ $t('finances.per_week') }}
                                </el-tag>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('finances.discounts.labels.active_discounts')" name="activeDiscounts">
                        <DiscountList
                            :discounts="userStore.state.allActiveDiscounts"
                            :isAdmin="false"
                        />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

    <!--    <div class="left_bubble" id="finances2">-->
    <!--        <div class="grid1">-->
    <!--            <p class="flex_right">We dont have money</p>-->
    <!--            <p class="flex_right">but</p>-->
    <!--            <p class="flex_right">we have spatie/laravel-permissions and Barryvdh aka PDF</p>-->
    <!--            <div class="flex_right">-->
    <!--                <img id="bob" src="http://localhost:8080/storage/bob.png" alt="gangsta bob">-->
    <!--            </div>-->
    <!--        </div>-->
    <!--    </div>-->
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
import {useRoomStore} from "@/stores/roomStore.js";

const
    isUserAdmin = ref(false),
    userStore = useUserStore(),
    roomStore = useRoomStore(),
    isLoading = ref(false),
    activeTab = ref('roomPrices');
const route = useRoute();

onMounted(async () => {
    isLoading.value = true;
    try {
        if (userStore.state.user === null) {
            await userStore.getUser(route.meta.uid);
        }
        if (roomStore.state.rooms === null) {
            await roomStore.getRooms();
        }
        isUserAdmin.value = userStore.state.user.roles.some(role => role.name === 'admin');
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false;
    }
});
</script>

<style scoped>
#finances {
    display: flex;
    justify-content: flex-start;
    padding: 50px;
}
.discount_link {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    color: rgba(26, 197, 60, 0.8);
    border-radius: 25px;
    padding: 10px;
    margin: 5px;
}
.floor-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e4e7ed;
}

.floor-title {
    font-weight: 600;
    font-size: 16px;
    color: #303133;
}

.floor-prices {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
}

.price-tag {
    font-size: 13px;
}
</style>