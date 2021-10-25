<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <div class="home">
    {{ user.addr }}
    <button @click="logoutAndRedirect">Logout</button>
    {{ profile }}
    <button @click="initAccount">Init Account</button>
    <div>Transaction Status: {{ transactionStatus ?? "--" }}</div>
    <input type="text" v-model="name"/>
    <button @click="changeName(name)">Change name</button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '../modules/auth';
import useProfile from '../modules/profile';

export default {
  name: 'Home',
  setup() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const {
      profile,
      fetchProfile,
      initAccount,
      changeName,
      transactionStatus,
    } = useProfile();
    const name = ref('');

    function logoutAndRedirect() {
      logout();
      router.push('/login');
    }

    fetchProfile();

    return {
      user,
      profile,
      logoutAndRedirect,
      initAccount,
      changeName,
      transactionStatus,
      name,
    };
  },
};
</script>
