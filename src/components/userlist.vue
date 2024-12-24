<script>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/api/axios';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'UserList',
  setup() {
    const users = ref([]);
    const error = ref(null);

    const userStore = new useUserStore;
    onMounted(async () => {
      await userStore.getUsers();
      users.value = userStore.state.users;
      error.value = userStore.state.error;
    });

    return { users, error };
  },
};
</script>

<template>
  <div>
    <h1>Список пользователей</h1>
    <div v-if="error">Ошибка: {{ error }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  </div>
</template>