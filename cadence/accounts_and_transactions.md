# Accounts and Transactions

### Doc

(Account)[https://docs.onflow.org/cadence/language/accounts]
(Transactions)[https://docs.onflow.org/cadence/language/transactions/]

### Account

1..n private keys w/ configurable weight
Allowing (multiple controllers)[https://www.coindesk.com/what-is-a-multisignature-crypto-wallet]

Two main areas:

- contract area
- account storage

#### Account Storage

Similar w/ traditional filesystem, data stored in (paths)[https://docs.onflow.org/cadence/language/accounts/#paths]. Only account owner has root access.

Make identifiers very specific to avoid conflict w/ other projects.

Three storage domains:
    - storage
    - private
    - public

[Where can i store my stuff ?)[https://docs.onflow.org/cadence/tutorial/02-hello-world/#account-filesystem-domain-structure-where-can-i-store-my-stuff]

Transactions have access to the /storage/ and /private/ domains of the accounts that signed the transaction.
