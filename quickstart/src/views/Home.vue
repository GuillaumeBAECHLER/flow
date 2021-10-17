<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    {{ user.addr }}
    <button @click="logoutAndRedirect">Logout</button>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import useUsers from '../modules/users';

export default {
  name: 'Home',
  setup() {
    const router = useRouter();
    const { user, logout } = useUsers();

    function logoutAndRedirect() {
      logout();
      router.push('/login');
    }

    return { user, logoutAndRedirect };
  },
};
</script>
