<template>
  <router-view/>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import * as fcl from '@onflow/fcl';
import useUsers from './modules/auth';

export default {
  name: 'Login',
  setup() {
    const { setUser } = useUsers();

    onMounted(() => {
      fcl.currentUser.subscribe(setUser);
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
