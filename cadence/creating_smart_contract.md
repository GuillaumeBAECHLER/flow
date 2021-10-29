# Creating a Smart Contract

[playground](https://play.onflow.org/f51905e8-6030-4641-9324-11a3f1a6091c)

Tx have two main phases :

- prepare [have access to private (AuthAccount](https://docs.onflow.org/cadence/language/accounts/#authaccount))
- execute (can only modify the objetcs removed or created in prepare phase / call functions on contracts)

For capabilities:

We choose /private/ if we only want to allow one or a small number of users to access it

We choose /public/ if we want any user in the network to be able to access it.

Capabilities always link to objects in the /storage/ domain.

Tx

```
// One signer

transaction {
    prepare(acct1: AuthAccount) {}
}

// Two signers

transaction {
    prepare(acct1: AuthAccount, acct2: AuthAccount) {}
}
```