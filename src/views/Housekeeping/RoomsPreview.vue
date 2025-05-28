
<template>
    <div class="bubble" v-if="!isLoading">
        <div>
            <el-form>
                <el-form-item>
                    <el-date-picker
                        type="daterange"
                        v-model="dateRange"
                        @change="onDateRangeChange"
                    ></el-date-picker>
                </el-form-item>
            </el-form>
        </div>

        <div class="building">
            <div v-for="(floor, index) in rooms" :key="index" class="floor">
                <h3>Floor {{ index }}</h3>
                <div class="rooms">
                    <div v-for="(room, roomIndex) in floor" :key="roomIndex" class="room">
                        <div class="flex_center">
                            {{ room.number }}
                        </div>
                        <div class="flex_center">
                            <div :class="room.calculatedStatus == 'Available' ? 'green' : 'red'">
                                <el-icon>
                                    <CircleCheck v-if="room.calculatedStatus === 'Available'" />
                                    <CircleClose v-else />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="bubble" v-else>
        <div class="flex_center">
            <p>Loading...</p>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'
import {useRoomStore} from "@/stores/roomStore.js";
const rooms = ref([]);
const roomStore = useRoomStore();
const isLoading = ref(false);
onMounted(async () => {
    console.log(roomStore.state.rooms)
    if (!roomStore.state.rooms || roomStore.state.rooms.length === 0) {
        isLoading.value = true
        try {
            await roomStore.getRooms();
        } catch (error) {

        } finally {
            isLoading.value = false;
        }
    }
    rooms.value = roomStore.state.rooms;
    console.log(rooms.value)
});
watch(rooms.value, (newVal) => {
    console.log(newVal)
})
const dateRange = ref([]);
async function onDateRangeChange([start, end]) {
    isLoading.value = true;
    try {
        await roomStore.getRooms({
            period: [{
                start: start,
                end: end
            }]
        });
        rooms.value = roomStore.state.rooms;
        // console.log({
        //     period: [{
        //         start: start,
        //         end: end
        //     }]
        // })
    } catch (error) {

    } finally {
        isLoading.value = false;
    }

}
</script>

<style scoped>
.flex_center {
    display: flex;
    justify-content: center;
    place-items: center;
}
.green {
    color: rgba(2, 225, 2, 0.75);
}
.red {
    color: rgba(255, 47, 47, 0.75);
}
.building {
    display: flex;
    flex-direction: column;
}

.floor {
    display: flex;
    flex-direction: column;
}

.rooms {
    display: flex;
    flex-wrap: wrap;
}

.room {
    display: grid;
    width: 75px;
    height: 75px;
    border: 1px solid #ccc;
    border-radius: 25px;
    text-align: center;
}

.el-date-picker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.el-date-picker__header-label {
    font-weight: 500;
    font-size: 16px;
    margin: 0 auto;
    text-align: center;
}
</style>