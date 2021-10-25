<template>
  <div class="login">
    <button @click="loginAndRedirect">Login</button>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import useAuth from '../modules/auth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const { user, login } = useAuth();

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
