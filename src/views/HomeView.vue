<script>
import { useUserStore } from '@/stores/userStore';
import { onBeforeMount, onMounted, ref } from 'vue';

export default {
  name: 'Home',
  setup() {
    const imageUrl = ref(`http://localhost:8080/storage/php.png`);
    return { imageUrl };
  }
}
</script>

<template>
  <div id="home">
    <header class="left_bubble">
      <h1 class="flex_center" id="title">
        Hotel "HELLO WORLD"
      </h1>
      <p class="flex_right">
        Welcome to our hotel. We are glad to see you here.
      </p>
      <p class="flex_right">
        You can book a room, see your reservations and much more.
      </p>
      
    </header>
    <main class="bubble">
      <p class="flex_center">
        <span id="imagetext">
          I love Laravel. Thank god human invented sanctum.
        </span>
      </p>
      <div class="flex_center">
        <img class="tarantino" :src="imageUrl" alt="">
      </div>
    </main>
    <footer class="right_bubble">
      <p class="flex_left">Laravel/VUE3 app</p>
    </footer>
  </div>
</template>

<style scoped>
.tarantino {
  width: 100%;
  height: 100%;
  width: 500px;
  object-fit: cover;
  object-position: center;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
#home p {
  margin: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
#home #title {
  margin-bottom: 15px;
  font-size: 2em;
  font-weight: bold;
  color: rgb(59, 59, 255);
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
}
#imagetext {
  font-family: 'Courier New', Courier, monospace;
}
</style>
