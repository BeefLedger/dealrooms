## Deal Rooms

The purpose of Deal Rooms is to allow the safe exchange of fungible tokens for non-fungible tokens (NFT) which represent real-world assets.

### Deal Room
A Deal Room is a set of contracts configured to handle one or more deals between a specific buyer, seller, and (optionally) other signatories.

Deals involve the exchange of a set of tokens from a specific asset contract (ERC-721) for an amount of tokens from a specific coin contract (ERC-20).

To settle the deal, signatories must sign it. By default, there are 5 possible signatories arranged in two groups:

 * Agents (any 2 must sign)
 	* Buyer: the agent wishing to obtain the assets
 	* Seller: the agent wishing to obtain ERC-20 tokens
 	* Arbitrator: a third party who can sign on behalf of the Buyer or Seller
 
 * Approvers (both must sign)
 	* Documentation Approver: their signature attests that paperwork was in order
 	* Sensor Approver: their signature attests that the condition of the asset is acceptible

### Usage

Create a Hub to manage your Deal Rooms:

```
const hubAddress = await DealRoomController.deployHub(signer)
```

Deploy a new Deal Room:

```typescript
const dealRoomCreateParams: DealRoomCreateParams = {
    hubAddress: "0x...",
    buyer: "0x...",
    seller: "0x...",
    arbitrator: "0x...",
    docApprover: "0x...",
    sensorApprover: "0x..."
}
roomAddress = await DealRoomController.deployRoom(dealRoomCreateParams, signer)
```

Set up a new Deal:

```typescript
// Make an instance of a DealRoomController
const dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, signer)
await dealRoomController.init()

// Make a deal     
const myDeal = await dealRoomController.makeDeal({
    erc20: "0x...",
    erc721: "0x...",
    price: new BigNumber(100), //Number of ERC-20 tokens (coins) requested
    assetItems: [ 20100123, 20100124, 20100125, 20100126] // Identifiers of ERC-721 tokens offered in exchange (assets)
})
```

Seller deposits assets into the escrow contract:

```typescript
dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, sellerSigner)
await dealRoomController.init()
await dealRoomController.depositDealAssets(myDeal.id, [20100123, 20100124, 20100125, 20100126])
```

Buyer deposits coins into the escrow contract:

```typescript
dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, buyerSigner)
await dealRoomController.init()
await dealRoomController.depositDealCoins(myDeal.id, 100)
```

Buyer/Seller signs to settle the deal:

```typescript
dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, agentSigner))
await dealRoomController.init()
await dealRoomController.proposeAgentsSettleDeal(myDeal.id)
```

Approver signs to settle the deal:

```typescript
dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, approverSigner)
await dealRoomController.init()
await dealRoomController.proposeMainSettleDeal(myDeal.id)
```

Until the deal has settled, the buyer and seller may withdraw their tokens freely. Once the deal has settled, the assets and coins can only be withdrawn by the new owners; the buyer can withdraw assets, the seller can withdraw coins.

```typescript
dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, sellerSigner)
await dealRoomController.init()
await dealRoomController.withdrawDealCoins(myDeal.id)

dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, buyerSigner)
await dealRoomController.init()
await dealRoomController.withdrawDealAssets(myDeal.id)
```

#DealRoomController methods

##Instantiation

###constructor(hubAddress: string, dealRoomAddress: string, signer: Signer)

To complete the initialisation, call `init()` after calling the constructor.  Once instantiated, instance methods will operate with the supplied hub, deal room and signer.

##Rooms

###(static) deployHub(signer: Signer): Promise\<DealRoomHub\> 
Deploy a Hub contract. This is responsible for maintaining a collection of DealRooms.


###(static) deployRoom(params: Deployer.DealRoomCreateParams, signer: Signer): Promise\<string\>
Deploy the contracts for a new DealRoom.

```typescript
type DealRoomCreateParams = {
    dealRoomHubAddress: string //Address of Hub contract
    buyer: string //Address of signatory
    seller: string //Address of signatory
    arbitrator: string //Address of signatory
    docApprover: string //Address of signatory
    sensorApprover: string //Address of signatory
}
```


###getAddress(): Promise\<string\>
Return the Ethereum address of the DealRoom contract.

###getBuyer(): Promise\<string\> 
Get the Ethereum address of the Buyer agent

###getSeller(): Promise\<string\>
Get the Ethereum address of the Seller agent


###getRooms(hubAddress: string, signer: Signer):Promise\<string[]\>
Return a list of Ethereum address for Deal Room contracts.

##Deals

###makeDeal(deal: Deal): Promise\<Deal\>
Create a new Deal in the Deal Room. Pass in a Deal struct with the following properties set:

```typescript
erc20: string // Ethereum address of coin contract
erc721: string // Ethereum address of token contract
assetItems: BigNumberish[] // Identifiers of asset items for sale
price: BigNumber // Requested price
```   

###getDeal(dealId: BigNumberish): Promise\<Deal\>
Get a Deal struct, containing information about the Deal:

```typescript
    id: BigNumberish
    erc20: string
    erc721: string
    price: BigNumber
    assetItems: BigNumberish[]
    agentConfirmations: number
    dealConfirmations: number
    dealTransaction: MultiSigTransaction
    agentTransaction: MultiSigTransaction
    status: number
```

###getDeals(): Promise\<Deal[]\> 
Get an array of Deals in the current Room.

###getDealCount(): Promise\<number\>
Return the number of Deals in the current Room.

##Assets and Coins

###getDealMissingAssets(id: BigNumberish): Promise\<number\>
Return an array of Asset tokens specified in a deal but not yet deposited in the escrow contract.

###getDealMissingCoins(id: BigNumberish): Promise\<number\>
Return the number of Coin tokens specified in a deal but not yet deposited in the escrow contract.

###getDealAssetStatus(dealId: BigNumberish): Promise<AssetStatus[]>
Return an array of objects indicating the owner of each asset specified in the Deal.

```typescript
assetId: BigNumber,
owner: string
```

###depositDealCoins(id: BigNumberish, amount: BigNumberish): Promise\<ContractReceipt\>
Deposit an amount of Coin tokens into the escrow contract.

###depositDealAssets(id: BigNumberish, items: BigNumberish[]): Promise\<ContractReceipt[]\>
Deposit the specified Asset tokens into the escrow contract.

###withdrawDealCoins(dealId: BigNumberish): Promise<ContractReceipt>
Withdraw all Coins associated with a given deal.

###withdrawDealAssets(dealId: BigNumberish): Promise<ContractReceipt> 
Withdraw all Assets associated with a given deal.

###getMyTokenBalance(id: BigNumberish): Promise\<BigNumberish\>
Return the amount of Coin tokens owned by the current Signer.

###getMyAssetBalance(id: BigNumberish): Promise\<BigNumberish\>
Return a list of Asset tokens owned by the current Signer.

###getAssetOwner(dealId: BigNumberish, assetId: BigNumberish): Promise\<string\>
Return the current owner of a given Asset token.

##Settlement
###proposeSettleDeal(dealId: BigNumberish): Promise\<string\>
Sign the Deal as the current Signer, requesting that it be settled.
