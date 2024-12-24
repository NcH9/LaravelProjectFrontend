<script setup>
import "@/assets/general.css";
import "@/assets/bubbles.css";
import "@/assets/forms.css";
import { RouterLink, RouterView } from 'vue-router'
import auth from "./components/auth.vue";
</script>

<template>
    <div class="grid1">
      <div class="flex_between">
        <nav class="flex_between">
          <RouterLink class="flex_center" to="/">Home</RouterLink>
          <RouterLink class="flex_center" to="/reservations">Reservation</RouterLink>
          <RouterLink class="flex_center" to="/housekeeping">Housekeeping</RouterLink>
          <RouterLink class="flex_center" to="/finances">Finances</RouterLink>
        </nav>
        <nav class="flex_between">
          <RouterLink class="flex_center" to="/customer_service">Customer Service</RouterLink>
          <auth></auth>
        </nav> 
      </div>
        <RouterView />
      <footer class="flex_center">
        <RouterLink class="flex_center" to="/about">About</RouterLink>
        <p>© 2024 Hotel "VASHA REKLAMA"</p>
      </footer>
    </div>
    
</template>

<style>
a {
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: rgba(26, 197, 60, 0.8);
  border-radius: 25px 25px 0 25px;
  /* background-color: rgba(0, 128, 0, 0.2); */
  padding: 10px;
  margin: 5px;
}
</style>

