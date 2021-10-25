import { reactive, toRefs, UnwrapRef } from 'vue';
import * as fcl from '@onflow/fcl';
import useAuth from './auth';

const state : UnwrapRef<{
  profile: any | null,
  transactionStatus: string,
}> = reactive({
  profile: null,
  transactionStatus: '',
});

export default function useProfile() {
  const setProfile = (newValue: any) => {
    state.profile = newValue;
  };

  const setTransactionStatus = (newValue: any) => {
    state.transactionStatus = newValue;
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

  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile
  
        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)
  
              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);
  };

  const changeName = async (newName: string) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile
  
        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
      args: (arg: any, t: any) => [arg(newName, t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    fcl.tx(transactionId).subscribe((res: any) => setTransactionStatus(res.status));
  };

  return {
    ...toRefs(state), setProfile, fetchProfile, initAccount, changeName,
  };
}
