## Introduction
This subgraph provides all the information you need for the glitter staking contracts: Contracts, Balances, Accounts and Pools, Positions and Stats. 

Watch out! The subgraph is a WIP and things might change over time. Please follow the #subgraphs channel at the [Aavegotchi Discord](https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-gltr-staking) if you integrate the subgraph into your dapp.

The endpoint is available here: https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-gltr-staking. 

The Playground where you can try out queries can be found here: https://thegraph.com/hosted-service/subgraph/aavegotchi/aavegotchi-gltr-staking.

## Setup
To run this Subgraph on your machine you need either a polygon archive node and a graph node running or an account on the hosted service of thegraph. 

If you run your own nodes you just need to run ```yarn create-local``` to setup the subgraph on the graph node and afterwards run ```yarn deploy-local``` to deploy the subgraph to the node.

If you use the hosted service. Please create an account and deploy via graph cli: ```npx graph deploy --product hosted-service  username/aavegotchi-gltr-staking --access-token access-token```

## Schema
The schema consists out of different Entities. First the ERC20 entities from the OpenZeppelin Subgraph, such as Account, ERC20Contract, ERC20Balance, ERC20Approval, ERC20Transer which represent the LP Token of the Pools and the user balances and transfers. Furtherly the schema contains entities about the staking, such as the Pools, PoolStats, Harvests and PoolPositions.

You can find at the Playground or in the [github repository](https://github.com/aavegotchi/aavegotchi-gltr-staking-subgraph) the [entire Schema](https://github.com/aavegotchi/aavegotchi-gltr-staking-subgraph/blob/main/schema.graphql).

## Examples
In this section we provide some example queries which should help you to get first ideas of what to fetch from the graph and how to do it. You can insert all events on the Playground and get the results. If you need help on how to integrate those queries in your app please take a look into the [General Section](https://docs.aavegotchi.com/subgraphs/general).


### Events
You can query the subgraph for every event happened on chain.
```
{  
  transferFromUser: erc20Transfers(where: {from:"0x1AD3d72e54Fb0eB46e87F82f77B284FC8a66b16C"}) {
  contract {
    id
  }  
  from {
      id
    }
    to {
      id
    }
    value
  }
  
  transferToUser: erc20Transfers(where: {to:"0x1AD3d72e54Fb0eB46e87F82f77B284FC8a66b16C"}) {
    contract {
      id
    }
    from {
      id
    }
    to {
      id
    }
    value
  }

}
```
### ERC20 Contracts / LP Token

You can fetch information about the indexed tokens through the erc20Contract entities. The indexed tokens are GLTR and the different Staking Pool LPs. 

With the following query you can fetch the tokens and much of them are staked.


```
{
  erc20Contracts {
    name
    totalSupply {
      value
    }
    balances(where: {account:"0x1fe64677ab1397e20a1211afae2758570fea1b8c"}) {
      value
    }
	}
}
```
### Pool Positions

Furthermore we maintain for each user and pool a position of how much he has staked.

```
{
  poolPositions(first: 1 orderBy: balance orderDirection:desc where: {pool:"1"}) {
    user {
      id
    }
    pool {
      id
    }
    balance
  }
}
```
### Pool Stats
Finally we store some stats about the pools. For example how many positions exists currently and total or how many lp tokens are staked.

```
{
  poolStats {
    numberOfCurrentPositions
    numberOfTotalPositions
    lpStaked
    pool {
      id
    }
	}
}
```

## Contribute

If you find bugs or have feature requests please create an issue in the [github repository](https://github.com/aavegotchi/aavegotchi-gltr-staking-subgraph/issues). If you want to hack something please just talk to us at the [Aavegotchi Discord](https://discord.gg/aavegotchi).