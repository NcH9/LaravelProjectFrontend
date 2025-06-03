<template>
    <RoomsPreview
        v-if="rooms.length !== 0"
    />
<!--    <div class="right_bubble" id="housekeeping">-->
<!--        <div class="grid1">-->
<!--            <div class="flex_center">-->
<!--                <h1>Housekeeping</h1>-->
<!--            </div>-->
<!--            <div class="flex_center">-->
<!--                <p>-->
<!--                    Here you can see the list of rooms and cleaning time.-->
<!--                </p>-->
<!--            </div>-->
<!--            <div class="grid1">-->
<!--                <p class="flex_center">-->
<!--                    Clearing time:-->
<!--                </p>-->
<!--                <p class="flex_center">-->
<!--                    First floor: 10:00 - 11:00 on Mondays-->
<!--                </p>-->
<!--                <p class="flex_center">-->
<!--                    Second floor: 11:00 - 12:00 on Tuesdays-->
<!--                </p>-->
<!--                <p class="flex_center">-->
<!--                    Third floor: 12:00 - 13:00 on Wednesdays-->
<!--                </p>-->
<!--                <p class="flex_center">-->
<!--                    Fourth floor: 10:00 - 11:00 on Thursdays-->
<!--                </p>-->
<!--                <p class="flex_center">-->
<!--                    Fifth floor: 11:00 - 12:00 on Fridays-->
<!--                </p>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div>-->
<!--            <img src="http://localhost:8080/storage/neuspel.png" alt="">-->
<!--        </div>-->
<!--        -->
<!--    </div>-->

<!--    <div class="left_bubble">-->
<!--        <div class="flex_center">-->
<!--            <p>-->
<!--                Inventory: Ycbl u xboct - Bot nawu dokymentbI (uHBeHTapb)-->
<!--            </p>-->
<!--        </div>-->
<!--    </div>-->
</template>

<script setup>
import { useRoomStore } from '@/stores/roomStore.js';
import { onMounted, ref } from 'vue';
import RoomsPreview from "@/views/Housekeeping/RoomsPreview.vue";

const roomStore = new useRoomStore();
const rooms = ref([]);

onMounted(async () => {
    console.log(roomStore.state.rooms)
    if (!roomStore.state.rooms || roomStore.state.rooms.length === 0) {
        await roomStore.getRooms();
    }
    rooms.value = roomStore.state.rooms;
    console.log(rooms.value)
});

</script>

<style scoped>
#housekeeping {
    display: flex;
    justify-content: flex-start;
    padding: 50px;
}
#housekeeping img {
    width: 300px;
    height: 300px;
    margin-left: 50px;
    object-fit: cover;
}
#housekeeping p {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    display: flex;
    justify-content: flex-start;
    font-weight: 300;
}
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
    /* gap: 20px; */
}

.floor {
    display: flex;
    flex-direction: column; /* Комнаты идут слева направо */
    gap: 10px; /* Расстояние между комнатами */
}

.rooms {
    display: flex;
    flex-wrap: wrap;
}

.room {
    display: grid;
    width: 150px; 
    margin-right: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
}
</style>