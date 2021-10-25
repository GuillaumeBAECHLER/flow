import { reactive, toRefs, UnwrapRef } from 'vue';
import * as fcl from '@onflow/fcl';
import useAuth from './auth';

const state : UnwrapRef<{
  profile: any | null,
}> = reactive({
  profile: null,
});

export default function useProfile() {
  const setProfile = (newValue: any) => {
    state.profile = newValue;
  };

  const fetchProfile = async () => {
    const { user } = useAuth();
    const profile = await fcl.query({
      cadence: `
          import Profile from 0xProfile

          pub fun main(address: Address): Profile.ReadOnly? {
            return Profile.read(address)
          }
        `,
      args: (arg: any, t: any) => [arg(user.value.addr, t.Address)],
    });

    if (!profile) {
      return;
    }

    setProfile(profile);
  };

  return {
    ...toRefs(state), setProfile, fetchProfile,
  };
}
