<template>
    <router-link :to="{name: 'create-reservation'}">{{$t('reservations.reserve_link')}}</router-link>
    <div class="grid2">
        <div class="left_bubble">
            <div class="flex_center">
                <el-button @click="showDialog = true">
                    <el-icon><House/></el-icon>
                </el-button>
            </div>
            <el-dialog v-model="showDialog" width="60%">
                <RoomsPreview />
            </el-dialog>
        </div>
        <ReservationList></ReservationList>
    </div>
</template>
<script setup>
import ReservationList from "@/views/Reservations/ReservationList.vue";
import { House } from '@element-plus/icons-vue'
import RoomsPreview from "@/views/Housekeeping/RoomsPreview.vue";
import {ref} from "vue";

const showDialog = ref(false);
</script>
<style scoped>
a {
    display: flex;
    justify-content: center;
    align-items: center;

    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    color: rgba(26, 197, 60, 0.8);
    border-radius: 25px;
    padding: 10px;
    margin: 5px;
}
</style>