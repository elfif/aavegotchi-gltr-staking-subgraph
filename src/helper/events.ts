import { transactions } from "@amxx/graphprotocol-utils";
import {fetchAccount} from "@openzeppelin/subgraphs/src/fetch/account"
import { ethereum } from "@graphprotocol/graph-ts";
import { Deposit, Harvest, Withdraw,EmergencyWithdraw } from "../../generated/GLTRFarm/GLTRFarm";
import { EmergencyWithdraw as EmergencyWithdrawEntity, Deposit as DepositEntity, Withdraw as WithdrawEntity, Harvest as HarvestEntity } from "../../generated/schema";

export function createDepositEvent(event: Deposit): DepositEntity {
    let id = event.transaction.hash.toHexString();
    let entity = new DepositEntity(id);
    entity.amount = event.params.amount;
    entity.emitter = fetchAccount(event.transaction.from).id;
    entity.transaction = transactions.log(event).id;
    entity.timestamp = event.block.timestamp;

    return entity;
}

export function createWithdrawEvent(event: Withdraw): WithdrawEntity {
    let id = event.transaction.hash.toHexString();
    let entity = new WithdrawEntity(id);
    entity.amount = event.params.amount;
    entity.emitter = fetchAccount(event.transaction.from).id;
    entity.transaction = transactions.log(event).id;
    entity.timestamp = event.block.timestamp;

    return entity;
}

export function createHarvestEvent(event: Harvest): HarvestEntity {
    let id = event.transaction.hash.toHexString();
    let entity = new HarvestEntity(id)
    entity.amount = event.params.amount;
    entity.emitter = fetchAccount(event.transaction.from).id;
    entity.transaction = transactions.log(event).id;
    entity.timestamp = event.block.timestamp;

    return entity;
}

export function createEmergencyWithdrawEvent(event: EmergencyWithdraw): EmergencyWithdrawEntity {
    let id = event.transaction.hash.toHexString();
    let entity = new EmergencyWithdrawEntity(id);
    entity.amount = event.params.amount;
    entity.emitter = fetchAccount(event.transaction.from).id;
    entity.transaction = transactions.log(event).id;
    entity.timestamp = event.block.timestamp;

    return entity;
}