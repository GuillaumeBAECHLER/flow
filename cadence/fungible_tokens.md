# Fungible Tokens

(doc)[https://docs.onflow.org/cadence/tutorial/03-fungible-tokens/]

(playground)[https://play.onflow.org/7c60f681-40c7-4a18-82de-b81b3b6c7915]

### Decentralizing Ownership

Flow ties ownership to each account via a new paradigm for asset ownership.

Solidity uses a central ledger system :

```
contract ERC20 {
    mapping (address => uint256) private _balances;

    function _transfer(address sender, address recipient, uint256 amount) {
        // ensure the sender has a valid balance
        require(_balances[sender] >= amount);

        // subtract the amount from the senders ledger balance
        _balances[sender] = _balances[sender] - amount;

        // add the amount to the recipient’s ledger balance
        _balances[recipient] = _balances[recipient] + amount
    }
}
```

There is one contract that manages the state of the tokens and every time that a user wants to do anything with their tokens, they have to interact with the central ERC20 contract.

### Intuiting Ownership with Resources

Each account owns a resource object in their account storage that records the number of tokens they own.
Interacting with the Fungible Token in the Flow Playground
Simplifies access control has we are in a resource of a user. This also leverage the Capability-based security concept.

This approach protects against bugs because no central ledger system exists. So the exploit must be in each token holder's account individually (more complicated and time consuming).

```
pub resource Vault: Provider, Receiver {

    // Balance of a user's Vault
    // we use unsigned integers for balances because they do not require the
    // concept of a negative number
    pub var balance: UFix64

    init(balance: UFix64) {
        self.balance = balance
    }

    pub fun withdraw(amount: UFix64): @Vault {
        self.balance = self.balance - amount
        return <-create Vault(balance: amount)
    }

    pub fun deposit(from: @Vault) {
        self.balance = self.balance + from.balance
        destroy from
    }
}
```

Cadence has built-in overflow and underflow protection.

If an address doesn’t have the correct resource type imported, the transaction will revert.


### Ensuring Security in Public: Capability Security

Capability Security removes the need to check msg.sender for access control purposes, because this functionality is handled by the protocol and type checker.

### Using Interfaces to Secure Implementations

Concept of design-by-contract, which uses preconditions and postconditions to document and programmatically assert the change in state caused by a piece of a program.

```
// Interface that enforces the requirements for withdrawing
// tokens from the implementing type
//
pub resource interface Provider {
    pub fun withdraw(amount: UFix64): @Vault {
        post {
            result.balance == amount:
                "Withdrawal amount must be the same as the balance of the withdrawn Vault"
        }
    }
}
// Interface that enforces the requirements for depositing
// tokens into the implementing type
//
pub resource interface Receiver {

    // There aren't any meaningful requirements for only a deposit function
    // but this still shows that thInteracting with the Fungible Token in the Flow Playground deposit function is required in an implementation.
    pub fun deposit(from: @Vault)
}
```

The interfaces ensure that specific fields and functions are present in the resource implementation and that those functions meet certain conditions before and/or after execution. 

All fields and functions in Cadence are private by default, meaning that the local scope can only access them.

### Fungible Tokens misc infos

Resource creation is restricted to the contract where it is defined.

Rewriting transfer tokens transaction to pass amount and reciever in args:

```
// Transfer Tokens

import ExampleToken from 0x01

// This transaction is a template for a transaction that
// could be used by anyone to send tokens to another account
// that owns a Vault
transaction(amount: UFix64, reciever: Address) {

  // Temporary Vault object that holds the balance that is being transferred
  var temporaryVault: @ExampleToken.Vault

  prepare(acct: AuthAccount) {
    // withdraw tokens from your vault by borrowing a reference to it
    // and calling the withdraw function with that reference
    let vaultRef = acct.borrow<&ExampleToken.Vault>(from: /storage/MainVault)
        ?? panic("Could not borrow a reference to the owner's vault")
      
    self.temporaryVault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    // get the recipient's public account object
    let recipient = getAccount(reciever)

    // get the recipient's Receiver reference to their Vault
    // by borrowing the reference from the public capability
    let receiverRef = recipient.getCapability(/public/MainReceiver)
                      .borrow<&ExampleToken.Vault{ExampleToken.Receiver}>()
                      ?? panic("Could not borrow a reference to the receiver")

    // deposit your tokens to their Vault
    receiverRef.deposit(from: <-self.temporaryVault)

    log("Transfer succeeded!")
  }
}
```