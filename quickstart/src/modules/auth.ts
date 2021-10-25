import { reactive, toRefs, UnwrapRef } from 'vue';
import * as fcl from '@onflow/fcl';

const state : UnwrapRef<{
  user: any,
}> = reactive({
  user: {
    loggedIn: null,
  },
});

export default function useUsers() {
  const setUser = (newValue: any) => {
    state.user = newValue;
  };

  const login = async () => {
    await fcl.logIn();
  };

  const logout = async () => {
    await fcl.unauthenticate();
  };

  return {
    ...toRefs(state), setUser, login, logout,
  };
}
