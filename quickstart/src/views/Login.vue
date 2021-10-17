<template>
  <div class="login">
    <button @click="loginAndRedirect">Login</button>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import useUsers from '../modules/users';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const { user, login } = useUsers();

    async function loginAndRedirect() {
      await login();
      router.push('/');
    }

    return { user, loginAndRedirect };
  },
};
</script>

<style scoped>
</style>
